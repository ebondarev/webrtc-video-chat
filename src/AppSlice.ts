import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { IParticipantsVideo } from './components/Participants';


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

export interface AddConnectedClientsIds extends Action {
  payload: IPeerId;
}

export interface SetUserNameAction extends Action {
  payload: string;
}

export interface SetPeerToPeerNodeTypeAction extends Action {
  payload: IPeerToPeerNodeType;
}

export type IPeerToPeerNodeType = 'root' | 'client' | null;

export interface AddRemoteStreamAction extends Action {
  payload: MediaStream;
}

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    user: {
      name: '',
    },
    rtc: {
      peerId: '' as IPeerId,
      idToConnect: '' as IPeerId,
      connectedClientsIds: [] as IPeerId[],
      peerToPeerNodeType: null as IPeerToPeerNodeType,
      remoteStreams: [] as IParticipantsVideo[],
    },
  },
  reducers: {
    setPeerId: (state, action: SetPeerIdAction) => {
      state.rtc.peerId = action.payload;
    },
    addConnectedClientsIds: (state, action: AddConnectedClientsIds) => {
      state.rtc.connectedClientsIds = [
        ...state.rtc.connectedClientsIds,
        action.payload
      ];
    },
    setUserName: (state, action: SetUserNameAction) => {
      state.user.name = action.payload;
    },
    setIdToConnect: (state, action: SetPeerIdAction) => {
      state.rtc.idToConnect = action.payload;
    },
    setPeerToPeerNodeType: (state, action: SetPeerToPeerNodeTypeAction) => {
      state.rtc.peerToPeerNodeType = action.payload;
    },
    addRemoteStream: (state, action: AddRemoteStreamAction) => {
      state.rtc.remoteStreams = [
        ...state.rtc.remoteStreams,
        {
          id: action.payload.id,
          srcObject: action.payload,
        }
      ] as any;
    },
  },
});

export const {
  setPeerId,
  setUserName,
  setIdToConnect,
  setPeerToPeerNodeType,
  addRemoteStream,
  addConnectedClientsIds
} = appSlice.actions;

export const appReducer = appSlice.reducer;
