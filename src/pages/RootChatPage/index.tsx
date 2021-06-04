import React from "react";
import { IPeerId, PeerDataConnection, PeerJS } from "../../App";
import { Chat } from "../../components/Chat";

export interface IRootChatPage {
  peerId: IPeerId;
  peer: PeerJS;
}

export const RootChatPage: React.FC<IRootChatPage> = ({ peerId, peer }) => {
  const [ connectedClientsIds, setConnectedClientsIds ] = React.useState< IPeerId[] >([]);

  React.useEffect(function listenPeerConnect() {
    peer.on('connection', (connect: PeerDataConnection) => {
      // Got connect from client
      // console.log('%c got connection ', 'background: black; color: white;', connect);
      const peerId = connect.peer;
      if (connectedClientsIds.includes(peerId)) {
        return;
      }
      setConnectedClientsIds([...connectedClientsIds, peerId]);
      console.log('%c connectedClientsIds ', 'background: black; color: white;', connectedClientsIds);
    });
  }, [ peer ]);

  return (
    <Chat peerId={ peerId } />
  );
}
