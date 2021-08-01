import React from "react";
import { Aside } from "../../components/Aside";
import { Chat, Message } from "../../components/Chat";
import { Footer } from "../../components/Footer";
import { MainVideo } from "../../components/MainVideo";
import { UsersVideo } from "../../components/UsersVideo";
import { VideoContainer } from "../../components/VideoContainer";
import { VideoMessangerContainer } from "../../components/VideoMessangerContainer";
import { useLocalMediaStream } from "../../hooks/useLocalMediaStream";
import { usePeer } from "../../hooks/usePeer";
import { useAppSelector } from "../../hooks/useStore";
import Peer from "../../vendor/peerjs";

export enum ConnectionDataTypes {
	CLIENT_IDS,
	PLAYBACK_TIMESTAMP,
	MESSAGE_LIST,
	MESSAGE,
	PLAYER_EVENT,
	CLOSE_CONNECTION,
	APPROVED,
}

export interface DataMessage {
	type: ConnectionDataTypes;
	payload?: unknown;
}

interface Props { }

export const Client: React.FC<Props> = () => {
	const userName = useAppSelector((state) => state.user.name);

	const [usersVideo, setUsersVideo] = React.useState<MediaStream[]>([]);
	const [messages, setMessages] = React.useState<Message[]>([]);

	const rootPeerIdRef = React.useRef(new URL(window.location.toString()).searchParams.get('room-id'));
	const mainVideoRef = React.useRef<HTMLVideoElement>(null);

	const localStream = useLocalMediaStream();
	const peer = usePeer();

	React.useEffect(() => {
		// Connect to Root
		if ((peer === undefined) || (localStream === undefined) || (rootPeerIdRef.current === null)) return;
		// Data connection to Root
		const dataConnectToRoot = peer.connect(rootPeerIdRef.current, { label: userName });
		dataConnectToRoot.on('open', () => {
			dataConnectToRoot.on('data', (dataMessageFromRoot: DataMessage) => {
				if (dataMessageFromRoot.type === ConnectionDataTypes.APPROVED) {
					// Media connection to Root
					const mediaConnectionToRoot = peer.call(rootPeerIdRef.current!, localStream);
					mediaConnectionToRoot.on('stream', (mediaStreamFromRoot) => {
						setUsersVideo((usersVideo) => {
							return usersVideo.every((stream) => stream.id !== mediaStreamFromRoot.id)
								? [...usersVideo, mediaStreamFromRoot]
								: usersVideo;
						});
					});
				}
			});
		});
	}, [peer, localStream]);

	React.useEffect(() => {
		// Add localStream to usersVideo
		if (localStream === undefined) return;
		setUsersVideo((currentValue) => [localStream, ...currentValue]);
	}, [localStream]);

	function handleNewMessage(message: Message) {
		setMessages((messages) => [...messages, message]);
	}

	return (
		<VideoMessangerContainer>
			<VideoContainer>
				<UsersVideo streams={usersVideo} />
				<MainVideo src='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' ref={mainVideoRef} />
			</VideoContainer>

			<Aside>
				<Chat numberParticipants={1}
					messages={messages}
					handleNewMessage={handleNewMessage} />
			</Aside>

			<Footer />
		</VideoMessangerContainer>
	);
}
