import React from "react";
import { IPeerId, PeerJS } from "../../App"
import { Chat } from "../../components/Chat";

export interface IClientChatPageProps {
  peerId: IPeerId;
  idToConnect: IPeerId;
  peer: PeerJS;
}

export const ClientChatPage: React.FC<IClientChatPageProps> = ({ peerId, idToConnect, peer }) => {

  React.useEffect(function setConnect() {
    const connect = peer.connect(idToConnect);
    console.log('%c connection ', 'background: black; color: white;', connect);
  }, []);

  return (
    <Chat peerId={ peerId } />
  );
}
