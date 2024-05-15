import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from '../redux/User/UserSlice';
import themeSlice from './theme/themeSlice';


const rootReducer = combineReducers({
  user: userSlice,
  theme:themeSlice
});

const persistConfig = {
  key: 'root', // The key should be a string
  storage,
  version: 1
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export const persistor = persistStore(store);