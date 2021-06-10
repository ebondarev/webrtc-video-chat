import React from 'react';
import { isRemoteData, PeerJS, PeerJSDataConnect, PeerJSMediaConnect, RemoteDataPeersIds, RemoteMediaConnect } from '../models';

export function useLocalMediaStream() {
  const [ stream, setStream ] = React.useState<MediaStream>();

  React.useEffect(function getMediaStream() {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: {
        width: 320,
        height: 240,
        facingMode: 'user',
      },
    };
  
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
      });
  }, []);

  return stream;
}

/* Ожидает подключение от клиента, сохраняет подключение и передаёт в ответ локальный стрим.
   Далее ожидает стрим от клиента, сохраняет его и возвращает связанные коннект и стрим. */
export function useRemoteMediaConnects(peerJS: PeerJS, stream: MediaStream | undefined) {
  const [ remoteMediaConnects, setRemoteMediaConnects ] = React.useState< RemoteMediaConnect[] >([]);

  React.useEffect(function handleRemoteConnection() {
    if (stream === undefined) return;
    /* Обработчик oncall вызывается дважды.
       После первого вызова стэйт не успевает обновиться и стрим добавляется дважды.
       Чтобы этого не было введена savedStreamsIds */
    const remoteStreamsIds: string[] = [];
    peerJS.on('call', (connect: PeerJSMediaConnect) => {
      connect.answer(stream);
      connect.on('stream', (remoteStream: MediaStream) => {
        if (remoteStreamsIds.includes(remoteStream.id)) return;
        setRemoteMediaConnects([
          ...remoteMediaConnects,
          {
            connect,
            stream: remoteStream,
          }
        ]);
        remoteStreamsIds.push(remoteStream.id);
      });
    });
  }, [ peerJS, stream ]);

  return remoteMediaConnects;
}

export function useRemotePeerDataOf(connect: PeerJSDataConnect | undefined) {
  const [ data, setData ] = React.useState<RemoteDataPeersIds>();
  
  React.useEffect(function listenRemotePeerData() {
    if (connect === undefined) {
      return;
    }

    connect.on('open', () => {
      connect.on('data', (data: unknown) => {
        if (isRemoteData(data)) {
          setData(data);
        }
      });
    });
  }, [ connect ]);

  return data;
}

export function useRemotePeerData(peerJS: PeerJS) {
  const [ data, setData ] = React.useState<RemoteDataPeersIds>();

  React.useEffect(function handleRemoteData() {
    peerJS.on('connection', (connect: PeerJSDataConnect) => {
      connect.on('open', () => {
        connect.on('data', (data: unknown) => {
          if (isRemoteData(data)) {
            setData(data);
          }
        });
      });
    });
  }, [ peerJS ]);

  return data;
}

export function useConnectToPeer(peerJS: PeerJS, peerId: string) {
  const [ connect, setConnect ] = React.useState< PeerJSDataConnect >();

  React.useEffect(function connectToPeer() {
    const connection = peerJS.connect(peerId);
    setConnect(connection);
  }, [ peerJS, peerId ]);

  return connect;
}

export function useReceiveConnection(peerJS: PeerJS) {
  React.useEffect(function handleRemoteConnection() {
    peerJS.on('connection', (connection: PeerJSDataConnect) => {

    });
  })
}

export function useExchangeMediaStreams(peerJS: PeerJS, peerId: string, stream: MediaStream | undefined) {
  const [ remoteMediaConnect, setRemoteMediaConnect ] = React.useState< RemoteMediaConnect >();

  React.useEffect(function exchangeStreams() {
    if (stream === undefined) return;
    /* Обработчик onstream вызывается дважды.
       После первого вызова стэйт не успевает обновиться и стрим добавляется дважды.
       Чтобы этого не была введена savedStreamsIds */
    const savedStreamsIds: string[] = [];
    const connect = peerJS.call(peerId, stream);
    connect.on('stream', (stream: MediaStream) => {
      if (savedStreamsIds.includes(stream.id)) return;
      setRemoteMediaConnect({ connect, stream });
      savedStreamsIds.push(stream.id);
    });
  }, [ peerId, stream ]);

  return remoteMediaConnect;
}

export function usePeerId(peerJS: PeerJS) {
  const [ peerId, setPeerId ] = React.useState< string >('');

  React.useEffect(function openPeer() {
    peerJS.on('open', (peerId: string) => {
      setPeerId(peerId);
    });
  }, []);

  return peerId;
}
