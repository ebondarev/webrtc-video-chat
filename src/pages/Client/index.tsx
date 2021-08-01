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
import { PlayerEventPayload } from "../Root";

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
				switch (dataMessageFromRoot.type) {
					case ConnectionDataTypes.APPROVED:
						// Media connection to Root
						const mediaConnectionToRoot = peer.call(rootPeerIdRef.current!, localStream);
						mediaConnectionToRoot.on('stream', (mediaStreamFromRoot) => {
							setUsersVideo((usersVideo) => {
								return usersVideo.every((stream) => stream.id !== mediaStreamFromRoot.id)
									? [...usersVideo, mediaStreamFromRoot]
									: usersVideo;
							});
						});
						break;
					case ConnectionDataTypes.PLAYER_EVENT:
						const payload = dataMessageFromRoot.payload as PlayerEventPayload;
						const mainVideoElement = mainVideoRef.current;
						if (mainVideoElement) {
							if (payload.eventName === 'pause') {
								const isVideoBuffering = mainVideoElement.networkState === mainVideoElement.NETWORK_LOADING;
								if (isVideoBuffering === false) {
									mainVideoElement.currentTime = payload.progress;
									mainVideoElement.pause();
								}
							} else if ((payload.eventName === 'play') || (payload.eventName === 'playing') || (payload.eventName === 'seeked')) {
								mainVideoElement.currentTime = payload.progress;
								mainVideoElement.play();
							} else if (payload.eventName === 'waiting') {
								mainVideoElement.pause();
							} else if (payload.eventName === 'timeupdate') {
								const currentTimeDiff = mainVideoElement.currentTime - payload.progress;
								enum playbackRate {
									EXTRA_SLOW = 0.5,
									SLOW = 0.75,
									NORMAL = 1.0,
									FAST = 1.25,
									EXTRA_FAST = 1.5,
								};
								if ((Math.abs(currentTimeDiff) < 0.3) && (mainVideoElement.playbackRate !== playbackRate.NORMAL)) {
									mainVideoElement.playbackRate = playbackRate.NORMAL;
								} if ((0.3 <= currentTimeDiff) && (currentTimeDiff < 1.5) && (mainVideoElement.playbackRate !== playbackRate.SLOW)) {
									mainVideoElement.playbackRate = playbackRate.SLOW;
								} else if ((-0.3 >= currentTimeDiff) && (currentTimeDiff > -1.5) && (mainVideoElement.playbackRate !== playbackRate.FAST)) {
									mainVideoElement.playbackRate = playbackRate.FAST;
								} else if (currentTimeDiff >= 1.5 && currentTimeDiff < 2.5) {
									mainVideoElement.playbackRate = playbackRate.EXTRA_SLOW;
								} else if (currentTimeDiff <= -1.5 && currentTimeDiff > -2.5) {
									mainVideoElement.playbackRate = playbackRate.EXTRA_FAST;
								} else {
									mainVideoElement.currentTime = payload.progress;
								}
							}
						}
						break;
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
				<MainVideo src='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
					ref={mainVideoRef}
					autoPlay={true}
				/>
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
