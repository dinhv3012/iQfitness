import { configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import { persistedReducer } from '../reducers/index';
import { persistStore } from 'redux-persist';
import { app as firebaseApp } from "./persistance/firebase";
import { persistance } from "./persistance/persistance";
import { getUserAuthStatus } from "./persistance/firebase";

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
const persistor = persistStore(store);

store.dispatch(getUserAuthStatus()) //makes sure that if the user account no longer exists, for instance, it will get logged out

persistance(store, firebaseApp)


export { store, persistor };