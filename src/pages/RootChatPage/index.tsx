import React from "react";
import { IPeerId, PeerDataConnection, PeerJS } from "../../App";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';

export interface IRootChatPage {
  peerId: IPeerId;
  peer: PeerJS;
}

export const RootChatPage: React.FC<IRootChatPage> = ({ peerId, peer }) => {
  const [ connectedClientsIds, setConnectedClientsIds ] = React.useState< IPeerId[] >([]);

  React.useEffect(function handleClientsConnection() {
    peer.on('connection', (connect: PeerDataConnection) => {
      const peerId = connect.peer;
      if (connectedClientsIds.includes(peerId)) {
        return;
      }
      setConnectedClientsIds((ids) => [...ids, peerId]);
    });
  }, [ peer ]);

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
