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
import Peer from "../../vendor/peerjs";

export enum ConnectionDataTypes {
  CLIENT_IDS = 'client_ids',
  PLAYBACK_TIMESTAMP = 'playback_timestamp',
  MESSAGE_LIST = 'message_list',
  MESSAGE = 'message',
  PLAYER_EVENT = 'player_event',
  CLOSE_CONNECTION = 'close_connection',
}

interface Props {}

export const Client: React.FC<Props> = () => {
	const [usersVideo, setUsersVideo] = React.useState<MediaStream[]>([]);
	const [otherClientsDataConnections, setOtherClientsDataConnections] = React.useState<Peer.DataConnection[]>([]);
	const [messages, setMessages] = React.useState<Message[]>([]);

	const rootPeerIdRef = React.useRef(new URL(window.location.toString()).searchParams.get('room-id'));
	const dataConnectionToRootRef = React.useRef<Peer.DataConnection>();
	const mediaConnectionToRootRef = React.useRef<Peer.MediaConnection>();
	const mainVideoRef = React.useRef<HTMLVideoElement>(null);

	const localStream = useLocalMediaStream();
	const peer = usePeer();

	React.useEffect(() => {
		// Set data connection to root
		if (peer && rootPeerIdRef.current && localStream) {
			dataConnectionToRootRef.current = peer.connect(rootPeerIdRef.current, {serialization: 'json'});
			dataConnectionToRootRef.current.on('open', () => {
				dataConnectionToRootRef.current?.on('data', (dataFromRoot: any) => {
					switch(dataFromRoot.type) {
            case ConnectionDataTypes.CLIENT_IDS:
							console.log('[LOG]', 'ConnectionDataTypes.CLIENT_IDS from Root', dataFromRoot.payload);
              // Установить соединение с клиентами из пришедшего фида с которыми оно ещё не было установлено
							dataFromRoot.payload
								.filter((id: string) => otherClientsDataConnections.every((connection) => connection.peer !== id))
								.forEach((id: string) => {console.log('[LOG]', 'call id', id); peer.call(id, localStream!);});
              /*dataFromRoot.payload.forEach((id: string) => {
								if (otherClientsDataConnections.some((connection) => connection.peer === id)) return;
                peer.call(id, localStream!);
              });*/
              break;
            case ConnectionDataTypes.MESSAGE_LIST:
							setMessages((messages) => [...messages, ...dataFromRoot.payload]);
              break;
            case ConnectionDataTypes.MESSAGE:
							setMessages((messages) => [...messages, dataFromRoot.payload]);
              break;
            case ConnectionDataTypes.PLAYER_EVENT:
							const mainVideoElement = mainVideoRef.current;
              if (mainVideoElement) {
                const { eventType, playerCurrentTime } = dataFromRoot.payload;
                if (eventType === 'pause') {
                  const isVideoBuffering = mainVideoElement.networkState === mainVideoElement.NETWORK_LOADING;
                  if (isVideoBuffering === false) {
                    mainVideoElement.currentTime = playerCurrentTime;
                    mainVideoElement.pause();
                  }
                } else if ((eventType === 'play') || (eventType === 'playing') || (eventType === 'seeked')) {
                  mainVideoElement.currentTime = playerCurrentTime;
                  mainVideoElement.play();
                } else if (eventType === 'waiting') {
                  mainVideoElement.pause();
                } else if (eventType === 'timeupdate') {
                  const currentTimeDiff = mainVideoElement.currentTime - playerCurrentTime;
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
                    mainVideoElement.currentTime = playerCurrentTime;
                  }
                }
              }
              break;
            case ConnectionDataTypes.PLAYBACK_TIMESTAMP:
							if (mainVideoRef.current) {
								mainVideoRef.current.currentTime = dataFromRoot.payload;
							}
              break;
            // case ConnectionDataTypes.CLOSE_CONNECTION:
            //   Object.keys(peerConnections)
            //     .forEach((key) => {
            //       peerConnections[key]
            //         .forEach((connection: Peer.DataConnection | Peer.MediaConnection) => connection.close());
            //    });
            //   location.replace(location.origin);
            //   break;
          }
				})
			})
		}
		// Если в список зависимостей добавить otherClientsDataConnections, то хук будет вызываться чаще чем нужно
		// Хук должен вызываться один раз когда peer и localStream не undefined
	}, [peer, /* otherClientsDataConnections,  */localStream]);

	React.useEffect(() => {
		// Set media connection to root
		if ((peer === undefined) || (rootPeerIdRef.current === null) || (localStream === undefined)) return;
		const mediaConnectToRoot = peer.call(rootPeerIdRef.current, localStream);
		mediaConnectionToRootRef.current = mediaConnectToRoot;
		mediaConnectToRoot.on('stream', (rootMediaStream) => {
			setUsersVideo((usersVideo) => {
				return usersVideo.find((stream) => stream.id === rootMediaStream.id)
					? usersVideo
					: [...usersVideo, rootMediaStream];
			});
		});
	}, [peer, localStream]);

	React.useEffect(() => {
		// Add localStream to usersVideo
		if (localStream === undefined) return;
		setUsersVideo((currentValue) => [localStream, ...currentValue]);
	}, [localStream]);

	/*React.useEffect(() => {
		// Get media connect from another clients
		if ((peer === undefined) || (localStream === undefined)) return;
		peer.on('call', (call) => {
			console.log('[LOG]', 'answer another client');
			call.answer(localStream);
		});
	}, [peer, localStream]);*/

	function getNumberParticipants(): number {
		let number = otherClientsDataConnections.length;
		if (dataConnectionToRootRef.current) {
			number += 1;
		}
		return number + 1;
	}

	function handleNewMessage(message: Message) {
		dataConnectionToRootRef.current?.send({type: ConnectionDataTypes.MESSAGE, payload: message});
		otherClientsDataConnections.forEach((connection) => connection.send({type: ConnectionDataTypes.MESSAGE, payload: message}));
		setMessages((messages) => [...messages, message]);
	}

	return (
		<VideoMessangerContainer>
			<VideoContainer>
				<UsersVideo streams={usersVideo} />
				<MainVideo src='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' ref={mainVideoRef} />
			</VideoContainer>

			<Aside>
				<Chat numberParticipants={getNumberParticipants()}
					messages={messages}
					handleNewMessage={handleNewMessage} />
			</Aside>

			<Footer />
		</VideoMessangerContainer>
	);
}
