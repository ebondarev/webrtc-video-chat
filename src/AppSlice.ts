import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

const peerConfig = {
  'iceServers': [
    { url: 'stun:stun01.sipphone.com' },
    { url: 'stun:stun.ekiga.net' },
    { url: 'stun:stun.fwdnet.net' },
    { url: 'stun:stun.ideasip.com' },
    { url: 'stun:stun.iptel.org' },
    { url: 'stun:stun.rixtelecom.se' },
    { url: 'stun:stun.schlund.de' },
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'stun:stun2.l.google.com:19302' },
    { url: 'stun:stun3.l.google.com:19302' },
    { url: 'stun:stun4.l.google.com:19302' },
    { url: 'stun:stunserver.org' },
    { url: 'stun:stun.softjoys.com' },
    { url: 'stun:stun.voiparound.com' },
    { url: 'stun:stun.voipbuster.com' },
    { url: 'stun:stun.voipstunt.com' },
    { url: 'stun:stun.voxgratia.org' },
    { url: 'stun:stun.xten.com' },
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    }
  ]
};

export interface PeerDataConnection {
  send: (data: any) => void;
  close: () => void;
  on: (
    event: PeerEvent,
    callback: (data: any) => void
  ) => void;
  dataChannel: RTCDataChannel;
  label: string;
  metadata: any;
  open: boolean;
  peerConnection: RTCPeerConnection;
  peer: IPeerId;
  reliable: boolean;
  serialization: 'binary' | 'binary-utf8' | 'json' | 'none';
  type: string;
  bufferSize: number;
}

export type PeerEvent = 'open' | 'connection' | 'call' | 'close' | 'disconnected' | 'error';

export type PeerJS = {
  connect: (id: IPeerId) => PeerDataConnection;
  on: (
    event: PeerEvent,
    fn: (data: any) => void
  ) => void;
};


export type IPeerId = string;

export interface State {
  peerId: IPeerId;
  userName: string;
}

interface Action {
  type: string;
}

export interface SetPeerIdAction extends Action {
  payload: IPeerId;
}

export interface SetUserNameAction extends Action {
  payload: string;
}

export interface SetPeerToPeerNodeTypeAction extends Action {
  payload: IPeerToPeerNodeType;
}

export type IPeerToPeerNodeType = 'root' | 'client' | null;

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    peerId: '' as IPeerId,
    idToConnect: '' as IPeerId,
    peerToPeerNodeType: null as IPeerToPeerNodeType,
    peerJS: new (window as any).Peer({ config: peerConfig }) as PeerJS,
    user: {
      name: '',
    },
  },
  reducers: {
    setPeerId: (state, action: SetPeerIdAction) => {
      state.peerId = action.payload;
    },
    setUserName: (state, action: SetUserNameAction) => {
      state.user.name = action.payload;
    },
    setIdToConnect: (state, action: SetPeerIdAction) => {
      state.idToConnect = action.payload;
    },
    setPeerToPeerNodeType: (state, action: SetPeerToPeerNodeTypeAction) => {
      state.peerToPeerNodeType = action.payload;
    }
  },
});

export const { setPeerId, setUserName, setIdToConnect, setPeerToPeerNodeType } = appSlice.actions;

export const appReducer = appSlice.reducer;
