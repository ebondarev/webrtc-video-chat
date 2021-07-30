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
import { WaitingList } from "../../components/WaitingList";
import { useLocalMediaStream } from "../../hooks/useLocalMediaStream";
import { usePeer } from "../../hooks/usePeer";
import Peer from "../../vendor/peerjs";
import { ConnectionDataTypes } from "../Client";
import s from './style.module.css';

export function Root() {
	const [linkToConnectToRoot, setLinkToConnectToRoot] = React.useState('');
	const [buttonCopyText, setButtonCopyText] = React.useState('Copy');
	const [usersVideo, setUsersVideo] = React.useState<MediaStream[]>([]);
	const [isShowWaitingListPopup, setIsShowWaitingListPopup] = React.useState(false);
	const [messages, setMessages] = React.useState<Message[]>([]);
	const [clientsMediaConnection, setClientsMediaConnection] = React.useState<Peer.MediaConnection[]>([]);
	const [clientsDataConnection, setClientsDataConnection] = React.useState<Peer.DataConnection[]>([]);

	const mainVideoRef = React.useRef<HTMLVideoElement>(null);

	const localStream = useLocalMediaStream();
	const peer = usePeer();

	React.useEffect(() => {
		// Add localStream to usersVideo
		if (localStream === undefined) return;
		setUsersVideo((currentValue) => [localStream, ...currentValue]);
	}, [localStream]);

	React.useEffect(() => {
		// Set text of linkToConnectToRoot
		if (peer === undefined) return;
		const pageLocation = new URL(`${window.location.origin}/client`);
		pageLocation.searchParams.append('room-id', peer.id);
		setLinkToConnectToRoot(pageLocation.toString());
	}, [peer]);

	React.useEffect(() => {
		// Revert buttonCopyText
		if (buttonCopyText === 'Copied') {
			setTimeout(() => {
				setButtonCopyText('Copy');
			}, 1500);
		}
	}, [buttonCopyText]);

	React.useEffect(() => {
		// Handle MediaStream from clients
		if ((peer === undefined) || (localStream === undefined)) return;
		peer.on('call', (clientMediaConnection) => {
			console.log('[LOG]', 'call');
			setClientsMediaConnection([...clientsMediaConnection, clientMediaConnection]);
			clientMediaConnection.answer(localStream);
			clientMediaConnection.on('stream', (clientStream) => {
				setUsersVideo((usersVideo) => {
					if (usersVideo.some((stream) => stream.id === clientStream.id)) return usersVideo;
					return [...usersVideo, clientStream];
				});
			});
			clientMediaConnection.on('close', () => {
				// Firefox does not yet support this event.
				console.log('[LOG]', 'close media connection');
			});
		});
		// Если в список зависимостей добавить clientsMediaConnection и usersVideo, то хук будет вызываться чаще чем нужно
		// Хук должен вызываться один раз когда peer и localStream не undefined
	}, [peer, localStream/* , clientsMediaConnection, usersVideo */]);

	React.useEffect(() => {
		// Handle DataStream from clients
		if (peer === undefined) return;
		peer.on('connection', (clientDataConnection) => {
			clientDataConnection.on('open', () => {
				/*console.log('[LOG]', 'clientsDataConnection', clientsDataConnection);
				clientsDataConnection.forEach((connection, index, arr) => {
					connection.send({type: ConnectionDataTypes.CLIENT_IDS, payload: arr.map((connection) => connection.peer)});
					connection.send({type: ConnectionDataTypes.PLAYBACK_TIMESTAMP, payload: mainVideoRef.current?.currentTime ?? 0});
				});
				clientDataConnection.send({type: ConnectionDataTypes.CLIENT_IDS, payload: clientsDataConnection.map((connection) => connection.peer)});
				clientDataConnection.send({type: ConnectionDataTypes.PLAYBACK_TIMESTAMP, payload: mainVideoRef.current?.currentTime ?? 0});

				clientDataConnection.send({ type: ConnectionDataTypes.MESSAGE_LIST, payload: messages });
				*/
				clientDataConnection.on('data', (data: any) => {
					if (data.type === ConnectionDataTypes.MESSAGE) {
						setMessages((messages) => [...messages, data.payload]);
					} else if (data.type === ConnectionDataTypes.CLOSE_CONNECTION) {
						setClientsDataConnection(
							clientsDataConnection.filter((connection) => connection.peer !== clientDataConnection.peer)
						);
						setClientsMediaConnection(
							clientsMediaConnection.filter((connection) => connection.peer !== clientDataConnection.peer)
						);
					}
				});
			});
			clientDataConnection.on('close', () => {
				// Firefox does not yet support this event.
				console.log('[LOG]', 'close data connection');
			});
			setClientsDataConnection((connections) => {
				if (connections.some((connect) => connect.peer === clientDataConnection.peer)) return connections;
				console.log('[LOG]', 'add clientDataConnection');
				return [...connections, clientDataConnection];
			});
		});
	}, [peer/* , clientsDataConnection, clientsMediaConnection, messages */]);

	React.useEffect(() => {
		// Notify clients about changes in clients
		clientsDataConnection.forEach((connection, index) => {
			console.log('[LOG]', 'send clients ids another clients', clientsDataConnection.filter((_connection) => _connection.peer !== connection.peer).map((_connection) => _connection.peer));
			connection.send({
				type: ConnectionDataTypes.CLIENT_IDS,
				payload: clientsDataConnection
					.filter((_connection) => _connection.peer !== connection.peer)
					.map((_connection) => _connection.peer)
			});
			connection.send({
				type: ConnectionDataTypes.PLAYBACK_TIMESTAMP,
				payload: mainVideoRef.current?.currentTime ?? 0
			});
		});
	}, [clientsDataConnection]);

	function handleClickShareRoomButton() {
		setButtonCopyText('Copied');
		navigator.clipboard.writeText(linkToConnectToRoot)
			.then(() => console.log('Ok!'))
			.catch((error) => console.log('Error!', error));
	}

	function handleNewMessage(message: Message) {
		clientsDataConnection.forEach((connection) => connection.send({type: ConnectionDataTypes.MESSAGE, payload: message}));
		setMessages((messages) => [...messages, message]);
	}

	function getNumberParticipants(): number {
		let number = clientsDataConnection.length;
		return number + 1;
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
					<MainVideo src='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' ref={mainVideoRef} />
				</VideoContainer>

				<Aside>
					<Chat numberParticipants={getNumberParticipants()}
						messages={messages}
						handleNewMessage={handleNewMessage} />
				</Aside>

				<Footer />
			</VideoMessangerContainer>

			{isShowWaitingListPopup && <Popup onClose={() => setIsShowWaitingListPopup(false)}><WaitingList /></Popup>}
		</>
	);
}
