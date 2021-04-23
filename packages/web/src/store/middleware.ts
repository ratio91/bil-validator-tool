import { Middleware } from 'redux';
import _ from 'lodash';
import { Action } from '../actions';

export const actionToPlainObject: Middleware = () => (next) => (action: Action) => {
  if (_.get(action, 'type')) {
    return next({ ...action });
  }

  throw new Error(`action must be an object: ${action}`);
};
