import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "./loaderSlice";
import { usersSlice } from "./usersSlice";

const store = configureStore({
  reducer: {
    loaders: loaderSlice.reducer,
    users: usersSlice.reducer,
  },
});

export default store;
