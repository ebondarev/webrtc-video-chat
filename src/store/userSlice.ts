import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface State {
  name: string;
	avatar: string;
}

const initialState: State = {
  name: '',
	avatar: 'https://cdn.iconscout.com/icon/free/png-256/avatar-366-456318.png',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const {setName} = userSlice.actions;

export default userSlice.reducer;
