import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

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
