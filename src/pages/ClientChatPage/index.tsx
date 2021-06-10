import React from "react";
import { addRemoteStream } from "../../AppSlice";
import { Chat } from "../../components/Chat";
import { useAppDispatch, useExchangeMediaStreams, useLocalMediaStream } from "../../hooks";
import { PeerJS } from "../../models";

export interface IClientChatPageProps {
  peerId: string;
  rootPeerId: string;
  peerJS: PeerJS;
}

export const ClientChatPage: React.FC< IClientChatPageProps > = ({ peerId, rootPeerId, peerJS }) => {
  const dispatch = useAppDispatch();

  const localStream = useLocalMediaStream();

  /* Клиент инициирует соединение с рутом, передаёт руту свой стрим и ожидает стрим от него */
  const remoteMediaConnect = useExchangeMediaStreams(peerJS, rootPeerId, localStream);

  return (
    <Chat peerId={ peerId } />
  );
}
