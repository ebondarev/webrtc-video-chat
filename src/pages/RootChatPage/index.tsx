import React from "react";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';
import { useLocalMediaStream, useRemoteMediaConnect, useRemotePeerData } from "../../hooks";
import { PeerJS } from "../../models";
import { AppContext } from "../../App";

export interface IRootChatPage { }


export const RootChatPage: React.FC< IRootChatPage > = () => {
  const { localPeerId, peerJS } = React.useContext(AppContext);

  const localStream = useLocalMediaStream();

  /* Рут ожидает подключение (стрим) от клиентов и передаёт им свой стрим */
  const remoteMediaConnects = useRemoteMediaConnect(peerJS, localStream);

  return (
    <>
      <Typography.Title
        level={3}
        style={{ color: 'rgb(209, 209, 209)' }}
      >
        ID: { localPeerId }
      </Typography.Title>
      <Chat />
    </>
  );
}
