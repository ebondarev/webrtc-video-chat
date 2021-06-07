import React from "react";
import { IPeerId } from "../../App"
import { addRemoteStream, PeerJS } from "../../AppSlice";
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

  React.useEffect(function setConnect() {
    if (idToConnect === '') {
      return;
    }

    const remoteStreams: MediaStream[] = []; // dispatch срабатывает с задержкой поэтому создана эта переменная
    navigator.mediaDevices.getUserMedia(constraints)
      .then((localStream) => {
        const call = peerJS.call(idToConnect, localStream);
        call.on('stream', (_stream) => {
          const stream = _stream as MediaStream;
          const isDuplicateStream = remoteStreams.some((_stream) => stream.id === _stream.id);
          if (isDuplicateStream) {
            return;
          }
          dispatch(addRemoteStream(stream));
          remoteStreams.push(stream);
        });
      });
  }, [ idToConnect, peerJS ]);

  // TODO: add response to connect handler

  return (
    <Chat peerId={ peerId } />
  );
}
