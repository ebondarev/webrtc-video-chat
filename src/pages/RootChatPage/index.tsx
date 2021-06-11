import React from "react";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';
import { useLocalMediaStream, useRemoteMediaConnects } from "../../hooks";
import { AppContext } from "../../App";
import { PeerJS, RemoteMediaConnect } from "../../models";

export interface IRootChatPage { }

export const RootChatPage: React.FC< IRootChatPage > = () => {
  const appContext = React.useContext(AppContext);
  const { localPeerId, peerJS } = appContext;

  const localStream = useLocalMediaStream();

  /* Рут ожидает подключения (стримы) от клиентов и передаёт им свой стрим */
  const remoteClientsMediaConnects = useRemoteMediaConnects(peerJS, localStream);

  React.useEffect(() => {
    notificationClientsAboutConnects(peerJS, remoteClientsMediaConnects);
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
          remoteMediaConnects: remoteClientsMediaConnects
        }}
      >
        <Chat />
      </AppContext.Provider>
    </div>
  );
}


function notificationClientsAboutConnects(peerJS: PeerJS, remoteClientsMediaConnects: RemoteMediaConnect[]) {
  const connectedIds = remoteClientsMediaConnects.map((item) => item.connect.peer);
  remoteClientsMediaConnects.forEach((item) => {
    const connect = peerJS.connect(item.connect.peer);
    connect.on('open', () => {
      connect.send({
        type: 'connected_ids',
        payload: connectedIds.filter((id) => id !== item.connect.peer),
      });
    });
  });
}
