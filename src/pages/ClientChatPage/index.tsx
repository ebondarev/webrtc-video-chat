import React from "react";
import { AppContext } from "../../App";
import { Chat } from "../../components/Chat";
import { useExchangeMediaStreams, useLocalMediaStream, useRemotePeerData } from "../../hooks";

export interface IClientChatPageProps { }

export const ClientChatPage: React.FC< IClientChatPageProps > = () => {
  const localStream = useLocalMediaStream();
  const appContext = React.useContext(AppContext);
  const { peerJS, rootPeerId, remoteMediaConnects } = appContext;

  /* Клиент инициирует соединение с рутом, передаёт руту свой стрим и ожидает стрим от него */
  const remoteRootMediaConnect = useExchangeMediaStreams(peerJS, rootPeerId, localStream);

  const remotePeerIds = useRemotePeerData(peerJS);
  // TODO: exchange data with other clients
  // const remotePeerMediaConnects = useExchangeMediaStreams(peerJS, );

  return (
    <div className="page">
      <AppContext.Provider
        value={{
          ...appContext,
          remoteMediaConnects: remoteRootMediaConnect ? [ ...remoteMediaConnects, remoteRootMediaConnect ] : remoteMediaConnects
        }}
      >
        <Chat />
      </AppContext.Provider>
    </div>
  );
}
