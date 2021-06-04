import React from "react";
import { IPeerId, PeerJS } from "../../App";
import { Chat } from "../../components/Chat";

export interface IRootChatPage {
  peerId: IPeerId;
  peer: PeerJS;
}

export const RootChatPage: React.FC<IRootChatPage> = ({ peerId, peer }) => {

  React.useEffect(function listenPeerConnect() {
    peer.on('connection', (connect) => {
      console.log('%c got connection ', 'background: black; color: white;', connect);
    });
  }, []);

  return (
    <Chat peerId={ peerId } />
  );
}
