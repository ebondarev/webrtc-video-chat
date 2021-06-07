import React from "react";
import { IPeerId } from "../../App";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';
import { PeerDataConnection, PeerJS } from "../../AppSlice";

export interface IRootChatPage {
  peerId: IPeerId;
  peerJS: PeerJS;
}

export const RootChatPage: React.FC<IRootChatPage> = ({ peerId, peerJS }) => {
  const [ connectedClientsIds, setConnectedClientsIds ] = React.useState< IPeerId[] >([]);

  React.useEffect(function handleClientsConnection() {
    peerJS.on('connection', (connect: PeerDataConnection) => {
      const peerId = connect.peer;
      if (connectedClientsIds.includes(peerId)) {
        return;
      }
      setConnectedClientsIds((ids) => [...ids, peerId]);
    });

    peerJS.on('call', (call) => {
      console.log('%c oncall ', 'background: #222; color: #bada55', call);
    });
  }, [ peerJS ]);

  React.useEffect(function handleChangeConnectedClients() {
    console.log('%c connectedClientsIds ', 'background: black; color: white;', connectedClientsIds);
  }, [ connectedClientsIds ]);

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
