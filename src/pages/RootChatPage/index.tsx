import React from "react";
import { IPeerId } from "../../App";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';
import { addConnectedClientsIds, addRemoteStream, PeerDataConnection, PeerJS } from "../../AppSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { IParticipantsVideo } from "../../components/Participants";

export interface IRootChatPage {
  peerId: IPeerId;
  peerJS: PeerJS;
}

const constraints: MediaStreamConstraints = {
  audio: true,
  video: {
    width: 320,
    height: 240,
    facingMode: 'user',
  },
};

export const RootChatPage: React.FC<IRootChatPage> = ({ peerId, peerJS }) => {
  const dispatch = useAppDispatch();

  const connectedClientsIds = useAppSelector((state) => state.app.rtc.connectedClientsIds);

  const localStreamRef = React.useRef<MediaStream>();

  React.useEffect(function getLocalStream() {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        localStreamRef.current = stream;
      });
  }, []);

  React.useEffect(function handleClientsConnection() {
    peerJS.on('connection', (connect: PeerDataConnection) => {
      const peerId = connect.peer;
      if (connectedClientsIds.includes(peerId)) {
        return;
      }
      dispatch(addConnectedClientsIds(peerId));
    });

    const remoteStreams: MediaStream[] = []; // dispatch срабатывает с задержкой поэтому создана эта переменная
    peerJS.on('call', (call) => {
      console.log('%c localStreamRef.current ', 'background: #222; color: #bada55', localStreamRef.current);
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
      }
      call.on('stream', (stream: MediaStream) => {
        const isDuplicateStream = remoteStreams.some((_stream) => stream.id === _stream.id);
        if (isDuplicateStream) {
          return;
        }
        dispatch(addRemoteStream(stream));
        remoteStreams.push(stream);
      });
    });
  }, [ peerJS ]);

  return (
    <>
      <Typography.Title
        level={3}
        style={{ color: 'rgb(209, 209, 209)' }}
      >
        ID: { peerId }
      </Typography.Title>
      <Chat peerId={ peerId } />
    </>
  );
}
