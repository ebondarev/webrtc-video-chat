import React from "react";
import { AppContext } from "../../App";
import { Chat } from "../../components/Chat";
import { useExchangeMediaStreams, useLocalMediaStream, useRemotePeerData } from "../../hooks";

export interface IClientChatPageProps { }

export const ClientChatPage: React.FC< IClientChatPageProps > = () => {
  const appContext = React.useContext(AppContext);
  const { peerJS, rootPeerId, remoteMediaConnects } = appContext;

  const localStream = useLocalMediaStream();

  /* Клиент инициирует соединение с рутом, передаёт руту свой стрим и ожидает стрим от него */
  const remoteRootMediaConnect = useExchangeMediaStreams(peerJS, rootPeerId, localStream);

  const remotePeerIds = useRemotePeerData(peerJS);
  console.log('%c [полученные от root ids других клиентов]', 'background: #222; color: #bada55', remotePeerIds);
  // TODO: exchange data with other clients
  // const remotePeerMediaConnects = useExchangeMediaStreams(peerJS, remotePeerIds?.payload || [], localStream);
  // console.log('%c [remotePeerMediaConnects] ', 'background: #000; color: #fff;', remotePeerMediaConnects);
  React.useEffect(function exchangeStreams() {
    if (remotePeerIds === undefined) {
      return;
    }
    if (localStream === undefined) {
      return;
    }
    remotePeerIds.payload.forEach((id) => {
      const call = peerJS.call(id, localStream);
      call.on('stream', (stream: MediaStream) => {
        console.log('%c [stream, call] ', 'background: #222; color: #bada55', stream, call);
      });
    });
  }, [ remotePeerIds ]);

  return (
    <div className="page">
      <AppContext.Provider
        value={{
          ...appContext,
          remoteMediaConnects: remoteRootMediaConnect ? [ ...remoteMediaConnects, remoteRootMediaConnect ] : remoteMediaConnects,
          localStream
        }}
      >
        <Chat />
      </AppContext.Provider>
    </div>
  );
}
