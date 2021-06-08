import React from "react";
import { IPeerId, PeerJS } from "../../App"
import { addRemoteStream } from "../../AppSlice";
import { Chat } from "../../components/Chat";
import { useAppDispatch, useConnectToPeer, useMediaStream, useRemoteDataOf } from "../../hooks";

export interface IClientChatPageProps {
  peerId: IPeerId;
  rootPeerId: IPeerId;
  peerJS: PeerJS;
}

export const ClientChatPage: React.FC<IClientChatPageProps> = ({ peerId, rootPeerId, peerJS }) => {
  const dispatch = useAppDispatch();

  const localStream = useMediaStream();

  const connectionToRootPeer = useConnectToPeer(peerJS, rootPeerId);

  const remoteRootData = useRemoteDataOf(connectionToRootPeer);
  React.useEffect(() => {
    console.log('%c remoteRootData ', 'background: #222; color: #bada55', remoteRootData);
  }, [ remoteRootData ]);

  // React.useEffect(function handleExchangeStreams() {
  //   if ((idToConnect === '') || (localStream === undefined)) {
  //     return;
  //   }
  //   // отправляет локальный стрим
  //   const call = peerJS.call(idToConnect, localStream);
  //   const _remoteStreams: MediaStream[] = []; // dispatch срабатывает с задержкой поэтому создана эта переменная
  //   // ожидает удалённый стрим
  //   call.on('stream', (_stream: any) => {
  //     const stream = _stream as MediaStream;
  //     const isDuplicateStream = _remoteStreams.some((_stream) => stream.id === _stream.id);
  //     if (isDuplicateStream) {
  //       return;
  //     }
  //     dispatch(addRemoteStream(stream));
  //     _remoteStreams.push(stream);
  //   });
  // }, [ idToConnect, peerJS, localStream ]);

  return (
    <Chat peerId={ peerId } />
  );
}
