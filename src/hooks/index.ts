import React from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { IPeerId } from '../AppSlice';
import { isRemoteData, PeerJS, PeerJSDataConnect, PeerJSMediaConnection as PeerJSMediaConnect, PeerJSMediaConnection, RemoteDataPeersIds } from '../models';
import { AppDispatch, RootState } from "../store";


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

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

export function useRemoteMediaStreams(peerJS: PeerJS, stream: MediaStream | undefined) {
  const [ remoteStreams, setRemoteStreams ] = React.useState<MediaStream[]>([]);
  
  React.useEffect(function handleRemoteConnection() {
    if(stream === undefined) return;
    peerJS.on('call', (call: PeerJSMediaConnection) => {
      call.answer(stream);
      call.on('strem', (remoteStream: MediaStream) => {
        // TODO: check to duplicates
        setRemoteStreams([...remoteStreams, remoteStream]);
      });
    });
  }, [ peerJS, stream ]);

  return remoteStreams;
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

export function useConnectToPeer(peerJS: PeerJS, peerId: IPeerId) {
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
      console.log('%c  ', 'background: black; color: white;', connection);
    })
  })
}

export function useExchangeMediaStreams(peerJS: PeerJS, peerId: string, stream: MediaStream | undefined) {
  const [ remoteStream, setRemoteStream ] = React.useState< MediaStream >();
  const [ remoteStreamConnect, setRemoteStreamConnect ] = React.useState< PeerJSMediaConnect >();
  
  React.useEffect(function exchangeStreams() {
    if (stream === undefined) return;
    const mediaConnect = peerJS.call(peerId, stream);
    setRemoteStreamConnect(mediaConnect);
    mediaConnect.on('strem', (stream: MediaStream) => {
      setRemoteStream(stream);
    });
  }, [ peerId, stream ]);

  return [ remoteStream, remoteStreamConnect ];
}
