import React from "react";
import { IPeerId, PeerJS } from "../../App"
import { addRemoteStream } from "../../AppSlice";
import { Chat } from "../../components/Chat";
import { useAppDispatch } from "../../hooks";

export interface IClientChatPageProps {
  peerId: IPeerId;
  idToConnect: IPeerId;
  peerJS: PeerJS;
}

const constraints: MediaStreamConstraints = {
  audio: true,
  video: {
    width: 320,
    height: 240,
    facingMode: 'user',
  },
};

export const ClientChatPage: React.FC<IClientChatPageProps> = ({ peerId, idToConnect, peerJS }) => {
  const dispatch = useAppDispatch();

  React.useEffect(function listenRemoteData() {
    peerJS.on('connection', (connection: any) => {
      connection.on('data', (data: any) => {
        console.log('%c client. data ', 'background: #222; color: #bada55', data);
      });
    })
  }, [ peerJS ]);

  React.useEffect(function setConnect() {
    if (idToConnect === '') {
      return;
    }

    const _remoteStreams: MediaStream[] = []; // dispatch срабатывает с задержкой поэтому создана эта переменная
    navigator.mediaDevices.getUserMedia(constraints)
      .then((localStream) => {
        const call = peerJS.call(idToConnect, localStream);
        call.on('stream', (_stream: any) => {
          const stream = _stream as MediaStream;
          const isDuplicateStream = _remoteStreams.some((_stream) => stream.id === _stream.id);
          if (isDuplicateStream) {
            return;
          }
          dispatch(addRemoteStream(stream));
          _remoteStreams.push(stream);
        });
      });
  }, [ idToConnect, peerJS ]);

  return (
    <Chat peerId={ peerId } />
  );
}
