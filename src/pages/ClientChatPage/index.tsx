import React from "react";
import { IPeerId } from "../../App"
import { PeerJS } from "../../AppSlice";
import { Chat } from "../../components/Chat";

export interface IClientChatPageProps {
  peerId: IPeerId;
  idToConnect: IPeerId;
  peerJS: PeerJS;
}

export const ClientChatPage: React.FC<IClientChatPageProps> = ({ peerId, idToConnect, peerJS }) => {

  React.useEffect(function setConnect() {
    const connect = peerJS.connect(idToConnect);
    console.log('%c connection ', 'background: black; color: white;', connect);
  }, [ idToConnect, peerJS ]);

  return (
    <Chat peerId={ peerId } />
  );
}
