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

export interface AddRemoteStreamAction extends Action {
  payload: MediaStream;
}

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    rtc: {
      connectedClientsIds: [] as IPeerId[],
      remoteStreams: [] as IParticipantsVideo[],
    },
  },
  reducers: {
    addConnectedClientsIds: (state, action: AddConnectedClientsIds) => {
      state.rtc.connectedClientsIds = [
        ...state.rtc.connectedClientsIds,
        action.payload
      ];
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
  addRemoteStream,
  addConnectedClientsIds
} = appSlice.actions;

export const appReducer = appSlice.reducer;
