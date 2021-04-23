import _ from 'lodash';

import { RESET_ERROR_MESSAGE_ACTION, ResetErrorMessageAction } from '../actions';

const initialErrorMessage = null;

/**
 * Catches actions of type `ResetErrorMessage` to empty `errorMessageTranslationKey` of state.
 * Else sets this variable by returning the error message translation key from the incoming
 * action if exists.
 *
 * @param state Input state to be altered.
 * @param action Action by which to alter state.
 * @return Unaltered state or null if action is of type `ResetErrorMessageAction` or error if
 * state contains one.
 */
const errorReducer = (state = initialErrorMessage, action: ResetErrorMessageAction) => {
  if (action.type === RESET_ERROR_MESSAGE_ACTION) {
    return null;
  }

  const error = _.get(action, 'payload.error');

  if (error) {
    return error;
  }

  return state;
};

export default errorReducer;
