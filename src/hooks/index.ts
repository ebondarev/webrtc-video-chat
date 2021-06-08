import React from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { PeerDataConnection as PeerDataConnect, PeerJS } from '../App';
import { IPeerId } from '../AppSlice';
import { RemoteData } from '../models';
import { AppDispatch, RootState } from "../store";


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useMediaStream() {
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

export function useRemoteDataOf(connection: PeerDataConnect | undefined) {
  const [ data, setData ] = React.useState<RemoteData>();
  
  React.useEffect(function listenRemotePeerData() {
    if (connection === undefined) {
      return;
    }

    connection.on('open', () => {
      connection.on('data', (data: unknown) => {
        // Add narrow from https://mariusschulz.com/blog/the-unknown-type-in-typescript
        if (data)
        setData(data);
      });
    });
  }, [ connection ]);

  return data;
}

// ?
export function useRemoteData(peerJS: PeerJS) {
  const [ data, setData ] = React.useState<unknown>();

  React.useEffect(function handleRemoteData() {
    peerJS.on('connection', (connect: PeerDataConnect) => {
      connect.on('open', () => {
        connect.on('data', (data: unknown) => {
          setData(data);
        });
      });
    });
  }, [ peerJS ]);

  return data;
}

export function useConnectToPeer(peerJS: PeerJS, peerId: IPeerId) {
  const [ connect, setConnect ] = React.useState< PeerDataConnect >();

  React.useEffect(function connectToPeer() {
    const connection = peerJS.connect(peerId);
    setConnect(connection);
  }, [ peerJS, peerId ]);

  return connect;
}
