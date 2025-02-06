// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import driverReducer from "../features/driverSlice";
import tripReducer from "../features/tripSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    driver: driverReducer,
    trip: tripReducer,
  },
});

export default store;
