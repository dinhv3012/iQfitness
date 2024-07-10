import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import {
    persistReducer,
} from 'redux-persist';

import exercises from './exercises';
import user from './user';

const persistConfig = {
    key: 'counter',
    storage,
};

const reducers = combineReducers({
    exercises, user
});

export const persistedReducer = persistReducer(persistConfig, reducers);

