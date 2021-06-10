import React from "react";
import { AppContext } from "../../App";
import { Chat } from "../../components/Chat";
import { useExchangeMediaStreams, useLocalMediaStream } from "../../hooks";
import { PeerJS } from "../../models";

export interface IClientChatPageProps { }

export const ClientChatPage: React.FC< IClientChatPageProps > = () => {
  const localStream = useLocalMediaStream();
  const { peerJS, rootPeerId } = React.useContext(AppContext);

  /* Клиент инициирует соединение с рутом, передаёт руту свой стрим и ожидает стрим от него */
  const remoteMediaConnect = useExchangeMediaStreams(peerJS, rootPeerId, localStream);

  return (
    <Chat />
  );
}
