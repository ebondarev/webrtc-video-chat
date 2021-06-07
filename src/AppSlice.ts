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

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    peerId: '' as IPeerId,
    userName: '',
  },
  reducers: {
    setPeerId: (state, action: SetPeerIdAction) => {
      state.peerId = action.payload;
    },
  },
});

export const { setPeerId } = appSlice.actions;

export const appReducer = appSlice.reducer;
