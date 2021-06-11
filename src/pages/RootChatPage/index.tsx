import React from "react";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';
import { useLocalMediaStream, useRemoteMediaConnects } from "../../hooks";
import { AppContext } from "../../App";
import { PeerJS, RemoteMediaConnect } from "../../models";

export interface IRootChatPage { }

export const RootChatPage: React.FC< IRootChatPage > = () => {
  const appContext = React.useContext(AppContext);
  const localStream = useLocalMediaStream();
  const { localPeerId, peerJS } = appContext;

  /* Рут ожидает подключения (стримы) от клиентов и передаёт им свой стрим */
  const remoteClientsMediaConnects = useRemoteMediaConnects(peerJS, localStream);

  React.useEffect(() => {
    notifyClientsAboutConnects(peerJS, remoteClientsMediaConnects);
  }, [ remoteClientsMediaConnects ]);

  return (
    <div className="page">
      <Typography.Title
        level={3}
        style={{ color: 'rgb(209, 209, 209)' }}
      >
        ID: { localPeerId }
      </Typography.Title>
      <AppContext.Provider
        value={{
          ...appContext,
          remoteMediaConnects: remoteClientsMediaConnects,
          localStream
        }}
      >
        <Chat />
      </AppContext.Provider>
    </div>
  );
}


function notifyClientsAboutConnects(peerJS: PeerJS, remoteClientsMediaConnects: RemoteMediaConnect[]) {
  const connectedIds = remoteClientsMediaConnects.map((item) => item.connect.peer);
  console.log('[remoteClientsMediaConnects]', remoteClientsMediaConnects);
  remoteClientsMediaConnects.forEach((item) => {
    const payload = connectedIds.filter((id) => id !== item.connect.peer);
    if (payload.length === 0) {
      return;
    }
    const connect = peerJS.connect(item.connect.peer);
    console.log('[root payload]', payload);
    connect.on('open', () => {
      connect.send({
        type: 'connected_ids',
        payload,
      });
    });
  });
}
