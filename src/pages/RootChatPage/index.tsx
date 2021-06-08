import React from "react";
import { IPeerId, PeerDataConnection, PeerJS } from "../../App";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';
import { addConnectedClientsIds, addRemoteStream } from "../../AppSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

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
    const _connectedClientsIds: IPeerId[] = [];
    peerJS.on('connection', (connect: PeerDataConnection) => {
      const peerId = connect.peer;
      if (_connectedClientsIds.includes(peerId)) {
        return;
      }
      dispatch(addConnectedClientsIds(peerId));
      _connectedClientsIds.push(peerId);
    });

    const _remoteStreams: MediaStream[] = []; // dispatch срабатывает с задержкой поэтому создана эта переменная
    peerJS.on('call', (call: any) => {
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
      }

      const peerId = call.peer;
      if (_connectedClientsIds.includes(peerId)) {
        return;
      }
      dispatch(addConnectedClientsIds(peerId));
      _connectedClientsIds.push(peerId);

      call.on('stream', (stream: MediaStream) => {
        const isDuplicateStream = _remoteStreams.some((_stream) => stream.id === _stream.id);
        if (isDuplicateStream) {
          return;
        }
        dispatch(addRemoteStream(stream));
        _remoteStreams.push(stream);
      });
    });
  }, [ peerJS ]);

  React.useEffect(function sendToClientsConnectedIds() {
    /*
     *
     * connectedClientsIds is empty
     * because did not call 'connection'
     *
     */
    connectedClientsIds.forEach((id) => {
      const connection = peerJS.connect(id);
      connection.on('open', () => {
        connection.send(connectedClientsIds);
      });
    });
  }, [ connectedClientsIds, peerJS ]);

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
