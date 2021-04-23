import { applyMiddleware, createStore, Store } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createBrowserHistory, createHashHistory } from 'history';
import { routerMiddleware as createRouterMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { Persistor } from 'redux-persist/es/types';

import createRootReducer, { RootReducerState } from '../reducers';
import rootSaga from '../sagas';
import { Action } from '../actions';
import { actionToPlainObject } from './middleware';

let history = createBrowserHistory({ basename: process.env.BASE_PATH });

if (process.env.USE_HASH_HISTORY) {
  history = createHashHistory({ basename: process.env.BASE_PATH });
}

export const rootReducer = createRootReducer(history);
const routerMiddleware = createRouterMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(actionToPlainObject, sagaMiddleware, routerMiddleware);

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['errorTranslationKey', 'browserWarning'],
};

const persistentReducer = persistReducer(persistConfig, rootReducer);

function configureStore(initialState = {}): { store: Store<RootReducerState, Action>; persistor: Persistor } {
  const store: Store<RootReducerState, Action> = createStore(persistentReducer, initialState, enhancer);
  const persistor = persistStore(store);
  sagaMiddleware.run(rootSaga);

  return { store, persistor };
}

export default { configureStore, history };
