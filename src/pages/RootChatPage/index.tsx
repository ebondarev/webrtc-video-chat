import React from "react";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';
import { useAppDispatch, useLocalMediaStream, useRemoteMediaConnect, useRemotePeerData } from "../../hooks";
import { PeerJS } from "../../models";

export interface IRootChatPage {
  peerId: string;
  peerJS: PeerJS;
}


export const RootChatPage: React.FC< IRootChatPage > = ({ peerId, peerJS }) => {
  const dispatch = useAppDispatch();

  const localStream = useLocalMediaStream();

  /* Рут ожидает подключение (стрим) от клиентов и передаёт им свой стрим */
  const remoteMediaConnects = useRemoteMediaConnect(peerJS, localStream);

  return (
    <>
      <Typography.Title
        level={3}
        style={{ color: 'rgb(209, 209, 209)' }}
      >
        ID: { peerId }
      </Typography.Title>
      <Chat peerId={ peerId } />
    </>
  );
}
