import React from "react";
import { Aside } from "../../components/Aside";
import { Button } from "../../components/Button";
import { Chat, Message } from "../../components/Chat";
import { Footer } from "../../components/Footer";
import { MainVideo } from "../../components/MainVideo";
import { Popup } from "../../components/Popup";
import { UsersVideo } from "../../components/UsersVideo";
import { VideoContainer } from "../../components/VideoContainer";
import { VideoMessangerContainer } from "../../components/VideoMessangerContainer";
import { WaitingItem, WaitingList } from "../../components/WaitingList";
import { useLocalMediaStream } from "../../hooks/useLocalMediaStream";
import { usePeer } from "../../hooks/usePeer";
import Peer from "../../vendor/peerjs";
import { ConnectionDataTypes, DataMessage } from "../Client";
import s from './style.module.css';

export type Connections = (Peer.DataConnection | Peer.MediaConnection)[];

export interface PlayerEventPayload {
	eventName: string;
	progress: number;
}

export function Root() {
	const [linkToConnectToRoot, setLinkToConnectToRoot] = React.useState('');
	const [buttonCopyText, setButtonCopyText] = React.useState('Copy');
	const [usersVideo, setUsersVideo] = React.useState<MediaStream[]>([]);
	const [isShowWaitingListPopup, setIsShowWaitingListPopup] = React.useState(false);
	const [messages, setMessages] = React.useState<Message[]>([]);
	const [waitingConnnections, setWaitingConnections] = React.useState<Connections>([]);
	const [approvedConnections, setApprovedConnections] = React.useState<Connections>([]);

	const localStream = useLocalMediaStream();
	const peer = usePeer();

	React.useEffect(() => {
		// Add localStream to usersVideo
		if (localStream === undefined) return;
		setUsersVideo((currentValue) => [localStream, ...currentValue]);
	}, [localStream]);

	React.useEffect(() => {
		// Create link to share room
		if (peer === undefined) return;
		const pageLocation = new URL(`${window.location.origin}/client`);
		pageLocation.searchParams.append('room-id', peer.id);
		setLinkToConnectToRoot(pageLocation.toString());
	}, [peer]);

	React.useEffect(() => {
		// Revert of button 'Copy'
		if (buttonCopyText === 'Copied') {
			setTimeout(() => {
				setButtonCopyText('Copy');
			}, 1500);
		}
	}, [buttonCopyText]);

	React.useEffect(() => {
		// Waiting connections from clients and add them to listWaitingClients
		if (peer === undefined) return;
		// Data connection
		peer.on('connection', (dataConnectionFromClient) => {
			dataConnectionFromClient.on('open', () => {
				dataConnectionFromClient.on('data', (dataMessageFromClient: DataMessage) => {
					if (dataMessageFromClient.type === ConnectionDataTypes.MESSAGE) {
						setMessages((messages) => [...messages, dataMessageFromClient.payload]);
					} else if (dataMessageFromClient.type === ConnectionDataTypes.CLOSE_CONNECTION) {
						setUsersVideo((usersVideo) => {
							return usersVideo.filter((stream) => stream.id !== dataMessageFromClient.payload.id);
						});
						setApprovedConnections((approvedConnections) => {
							approvedConnections
								.filter((connect) => (connect.peer !== dataConnectionFromClient.peer) && connect.type === 'data')
								.forEach((connect) => (connect as Peer.DataConnection).send({...dataMessageFromClient, peer: dataConnectionFromClient.peer}));
							return approvedConnections.filter((connect) => connect.peer !== dataConnectionFromClient.peer);
						});
					}
				});
			});
			setWaitingConnections((connections) => {
				const isSaved = connections.find((connection) => (connection.peer === dataConnectionFromClient.peer) && (connection.type === 'data'));
				if (isSaved) return connections;
				return [...connections, dataConnectionFromClient];
			});
		});
		// Media connection
		peer.on('call', (mediaConnectionFromClient) => {
			setApprovedConnections((approvedConnections) => {
				// В approvedConnections уже есть dataConnectionFromClient
				const isApproved = approvedConnections.some((connect) => connect.peer === mediaConnectionFromClient.peer);
				if (isApproved) {
					mediaConnectionFromClient.answer(localStream);
					mediaConnectionFromClient.on('stream', (clientStream: MediaStream) => {
						setUsersVideo((usersVideo) => {
							return usersVideo.every((stream) => stream.id !== clientStream.id) ? [...usersVideo, clientStream] : usersVideo;
						});
					});
					return [...approvedConnections, mediaConnectionFromClient];
				} else {
					return approvedConnections;
				}
			});
		});
	}, [peer]);

	React.useEffect(() => {
		approvedConnections
			.filter((connect) => connect.type === 'data')
			.forEach((connect) => (connect as Peer.DataConnection).send({ type: ConnectionDataTypes.MESSAGE_LIST, payload: messages }));
	}, [messages]);

	function handleClickShareRoomButton() {
		setButtonCopyText('Copied');
		navigator.clipboard.writeText(linkToConnectToRoot)
			.then(() => console.log('Ok!'))
			.catch((error) => console.log('Error!', error));
	}

	function handleNewMessage(message: Message) {
		setMessages((messages) => [...messages, message]);
	}

	function getWaitingList(listWaitingClients: Connections): WaitingItem[] {
		return listWaitingClients
			.filter((connect) => connect.type === 'data')
			.map((connect) => ({ id: connect.peer, name: (connect as Peer.DataConnection).label }));
	}

	function removeWaitingConnections(id: string) {
		setWaitingConnections(
			waitingConnnections
				.map((connect) => {
					if (connect.peer === id) {
						connect.close();
					}
					return connect;
				})
				.filter((connect) => connect.peer !== id)
		);
	}

	function sharePlayerEvent(approvedConnections: Connections, event: React.SyntheticEvent<HTMLVideoElement, Event>) {
		approvedConnections
			.filter((connect) => connect.type === 'data')
			.forEach((connect) => (connect as Peer.DataConnection).send({
				type: ConnectionDataTypes.PLAYER_EVENT,
				payload: {
					eventName: event.type,
					progress: (event.target as HTMLVideoElement).currentTime,
				},
			}));
	}

	function handleClickByCallEnd() {
		[...approvedConnections, ...waitingConnnections]
			.filter((connect) => connect.type === 'data')
			.map((connect) => {
				(connect as Peer.DataConnection).send({ type: ConnectionDataTypes.CLOSE_CONNECTION, payload: {peer: peer?.id} });
				return connect;
			});
		window.location.replace(window.location.origin);
	}

	function handleClickByCamera() {
		localStream?.getVideoTracks()
			.forEach((videoTrack) => {
				videoTrack.enabled = !videoTrack.enabled;
			});
	}

	function handleClickByMicrophone() {
		localStream?.getAudioTracks()
			.forEach((audioTrack) => {
				audioTrack.enabled = !audioTrack.enabled;
			});
	}

	return (
		<>
			<VideoMessangerContainer>
				{linkToConnectToRoot && <div className={s['share-room']}>
					<Button onClick={handleClickShareRoomButton}>{buttonCopyText}</Button>
					<div className={s['share-room__link']}>{linkToConnectToRoot}</div>
				</div>}

				<div className={s['toggle-waiting-list']}>
					<Button onClick={() => setIsShowWaitingListPopup(true)}>
						Waiting list
					</Button>
				</div>

				<VideoContainer>
					<UsersVideo streams={usersVideo} />
					<MainVideo src='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
						onPause={sharePlayerEvent.bind(null, approvedConnections)}
						onPlay={sharePlayerEvent.bind(null, approvedConnections)}
						onPlaying={sharePlayerEvent.bind(null, approvedConnections)}
						onTimeUpdate={sharePlayerEvent.bind(null, approvedConnections)}
						onSeeked={sharePlayerEvent.bind(null, approvedConnections)}
						onWaiting={sharePlayerEvent.bind(null, approvedConnections)}
						controls={true}
						autoPlay={true}
					/>
				</VideoContainer>

				<Aside>
					<Chat numberParticipants={usersVideo.length}
						messages={messages}
						handleNewMessage={handleNewMessage} />
				</Aside>

				<Footer onClickByCallEnd={handleClickByCallEnd} onClickByCamera={handleClickByCamera} onClickByMicrophone={handleClickByMicrophone} />
			</VideoMessangerContainer>

			{isShowWaitingListPopup && (
				<Popup onClose={() => setIsShowWaitingListPopup(false)}>
					<WaitingList waitingList={getWaitingList(waitingConnnections)}
						handleAdd={(id: string) => {
							const addedDataConnection = waitingConnnections.filter((connect) => (connect.peer === id) && (connect.type === 'data'))[0] as Peer.DataConnection;
							addedDataConnection.send({
								type: ConnectionDataTypes.APPROVED,
								payload: {
									messages,
									otherClientsId: approvedConnections.map((connect) => connect.peer),
								}
							});
							setApprovedConnections([...approvedConnections, ...waitingConnnections.filter((connect) => connect.peer === id)]);
							setWaitingConnections(
								waitingConnnections.filter((connect) => connect.peer !== id)
							);
						}}
						handleRemove={removeWaitingConnections}
					/>
				</Popup>
			)}
		</>
	);
}
