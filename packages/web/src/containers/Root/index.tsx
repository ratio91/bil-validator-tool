import React from 'react';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import { Store } from 'redux';

import Router from '../Router';
import { RootReducerState } from '../../reducers';
import { Action } from '../../actions';

/**
 * Root component of the react component rendering tree.
 *
 * @param store Store object holding the application's state tree.
 * @param history History object for navigation between pages.
 */
const Root = ({ store, history }: { store: Store<RootReducerState, Action>; history: History }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router />
    </ConnectedRouter>
  </Provider>
);

// With react-hot-loader, changing the source code will update the running web app in real time.
export default hot(module)(Root);
