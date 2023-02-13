import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import filemanagerSlice from "./slices/filemanagerSlice";
import { persistfileman } from "./slices/persistfilemanSlice";

const reducers = combineReducers({
  filemanager: filemanagerSlice,
  persistfileman: persistfileman,
});
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["persistfileman"],
};
const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
