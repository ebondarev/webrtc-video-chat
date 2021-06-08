import React from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { PeerJS } from '../App';
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

export function useRemoteRootData(peerJS: PeerJS) {
  const [ data, setData ] = React.useState<RemoteData>();
  
  React.useEffect(function listenRemotePeerData() {
    peerJS.on('connection', (connection: any) => {
      connection.on('open', () => {
        connection.on('data', (data: RemoteData | any) => {
          if (data?.type === 'peers_ids') {
            setData(data);
          }
        });
      });
    });
  }, [ peerJS ]);

  return data;
}
