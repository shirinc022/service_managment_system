import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './Slices/userSlice'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
  key: 'root',
  storage,
  whitelist:['user']  //specify which slicer need to persist
}

const persistedReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
  reducer: {
    user:persistedReducer
  },
  middleware:(getDefaultMiddleware)=>{
   return getDefaultMiddleware({
      serializableCheck: false  //persist cheyyano vendayo enne check aaka ithinte value anusarich aane
    })
  }
})


export const persistor = persistStore(store)