import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/api";

// reducers
import userSlice from "./features/userSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userSlice,
  },

  middleware: (defaultMiddleWare) =>
    defaultMiddleWare().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
