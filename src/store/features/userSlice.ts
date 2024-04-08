import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../interfaces";

const initialState: {
  user: TUser | null;
} = {
  user: null,
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    setUser: (state, { payload }: PayloadAction<TUser | null>) => {
      state.user = payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
