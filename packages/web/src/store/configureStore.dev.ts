import { applyMiddleware, compose, createStore, Store } from 'redux';
import { createBrowserHistory, createHashHistory } from 'history';
import { createLogger } from 'redux-logger';
import { routerActions, routerMiddleware as createRouterMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { Persistor } from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import createRootReducer, { RootReducerState } from '../reducers';
import rootSaga from '../sagas';
import * as appActions from '../actions';
import { Action } from '../actions';
import { actionToPlainObject } from './middleware';

let history = createBrowserHistory({ basename: process.env.BASE_PATH });

if (process.env.USE_HASH_HISTORY) {
  history = createHashHistory({ basename: process.env.BASE_PATH });
}

const rootReducer = createRootReducer(history);
const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['errorTranslationKey', 'browserWarning', 'browserWarningDismissed'],
};

const persistentReducer = persistReducer<RootReducerState>(persistConfig, rootReducer);

const configureStore = (initialState = {}): { store: Store<RootReducerState, Action>; persistor: Persistor } => {
  // Redux Configuration
  const middleware = [actionToPlainObject];
  const enhancers = [];

  // Saga Middleware
  middleware.push(sagaMiddleware);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // Router Middleware
  const router = createRouterMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...appActions,
    ...routerActions,
  };

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators,
        trace: true,
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store: Store<RootReducerState, Action> = createStore(persistentReducer, initialState, enhancer);
  const persistor = persistStore(store);
  // Start the saga
  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      // This fetches the new state of the reducers above.
      // For some reason the typing of our reducers does not play with the expected typings and with other lib typings
      // thus we opted to use any
      store.replaceReducer(persistReducer(persistConfig, createRootReducer(history)) as any);
    });
  }

  return { store, persistor };
};

export default { configureStore, history };
