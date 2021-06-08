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

  const localStreamRef = React.useRef<MediaStream>();

  React.useEffect(function getLocalMediaStream() {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((localStream) => {
        localStreamRef.current = localStream;
      });
  }, []);

  React.useEffect(function handleRemoteData() {
    peerJS.on('connection', (connection: any) => {
      connection.on('open', () => {
        console.log('%c client/open ', 'background: #222; color: #bada55');
        connection.on('data', (data: any) => {
          console.log('%c client/data top ', 'background: #222; color: #bada55');
          if (data?.type === 'clients ids') {
            console.log('%c client/data ', 'background: #222; color: #bada55', data);
          }
        });
      });
    });
  }, [ peerJS ]);

  React.useEffect(function handleExchangeStreams() {
    console.log('[LOG/client/condition]', (idToConnect === ''), (localStreamRef.current === undefined));
    if ((idToConnect === '') || (localStreamRef.current === undefined)) {
      return;
    }
    // отправляет локальный стрим
    const call = peerJS.call(idToConnect, localStreamRef.current);
    const _remoteStreams: MediaStream[] = []; // dispatch срабатывает с задержкой поэтому создана эта переменная
    // ожидает удалённый стрим
    call.on('stream', (_stream: any) => {
      const stream = _stream as MediaStream;
      const isDuplicateStream = _remoteStreams.some((_stream) => stream.id === _stream.id);
      if (isDuplicateStream) {
        return;
      }
      dispatch(addRemoteStream(stream));
      _remoteStreams.push(stream);
    });
  }, [ idToConnect, peerJS, localStreamRef.current ]);

  return (
    <Chat peerId={ peerId } />
  );
}
