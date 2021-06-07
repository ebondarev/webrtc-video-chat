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

export const RootChatPage: React.FC<IRootChatPage> = ({ peerId, peerJS }) => {
  const dispatch = useAppDispatch();

  const connectedClientsIds = useAppSelector((state) => state.app.rtc.connectedClientsIds);
  const remoteStreams = useAppSelector((state) => state.app.rtc.remoteStreams);

  React.useEffect(function handleClientsConnection() {
    console.log('%c effect ', 'background: #222; color: #bada55');
    peerJS.on('connection', (connect: PeerDataConnection) => {
      const peerId = connect.peer;
      if (connectedClientsIds.includes(peerId)) {
        return;
      }
      dispatch(addConnectedClientsIds(peerId));
    });

    const remoteStreams: MediaStream[] = []; // dispatch срабатывает с задержкой поэтому создана эта переменная
    peerJS.on('call', (call) => {
      call.answer();
      call.on('stream', (stream: MediaStream) => {
        const isDublicateStream = remoteStreams.some((_stream) => {
          return stream.id === _stream.id;
        });
        if (isDublicateStream) {
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
