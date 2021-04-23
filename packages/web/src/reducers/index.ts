import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { History } from 'history';

import cmrReducer from './cmrReducer';
import errorReducer from './errorReducer';
import changeEthereumNodeStatusReducer from './changeEthereumNodeStatusReducer';
import cmrTypeReducer from './cmrTypeReducer';
import browserWarningReducer from './browserWarningReducer';
import ethereumNodeReducer from './ethereumNodeReducer';

/**
 * Creates root reducer by combining all other reducers und using them to set the state's
 * attributes with their return values after every action.
 *
 * @param history History object for navigation.
 */
const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    cmr: cmrReducer,
    cmrType: cmrTypeReducer,
    errorTranslationKey: errorReducer,
    browserWarning: browserWarningReducer,
    status: changeEthereumNodeStatusReducer,
    ethereumNode: ethereumNodeReducer,
  });

export default createRootReducer;

export type RootReducerState = ReturnType<ReturnType<typeof createRootReducer>>;
