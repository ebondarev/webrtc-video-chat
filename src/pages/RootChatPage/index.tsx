import React from "react";
import { IPeerId, PeerDataConnection, PeerJS } from "../../App";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';
import { addConnectedClientsIds, addRemoteStream } from "../../AppSlice";
import { useAppDispatch, useAppSelector, useMediaStream } from "../../hooks";

export interface IRootChatPage {
  peerId: IPeerId;
  peerJS: PeerJS;
}


export const RootChatPage: React.FC<IRootChatPage> = ({ peerId, peerJS }) => {
  const dispatch = useAppDispatch();

  const connectedClientsIds = useAppSelector((state) => state.app.rtc.connectedClientsIds);

  const localStream = useMediaStream();

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
      if (localStream) {
        call.answer(localStream);
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
  }, [ peerJS, localStream ]);

  React.useEffect(function sendToClientsConnectedIds() {
    connectedClientsIds.forEach((id) => {
      const connection = peerJS.connect(id);
      connection.on('open', () => {
        const data = {
          type: 'peers_ids',
          payload: [ ...connectedClientsIds, peerId ],
        };
        connection.send(data);
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
