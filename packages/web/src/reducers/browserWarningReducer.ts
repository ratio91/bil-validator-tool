import _ from 'lodash';

import { BrowserWarningAction, RESET_BROWSER_WARNING_ACTION, ResetBrowserWarningAction } from '../actions';

/**
 * Catches actions of type `ResetBrowserWarningAction` to empty the `browserWarning` of the
 * state. In this case must return '' (instead of null) such that warning is known to be
 * dismissed. Catches actions of type `BrowserWarningAction` to set `errorMessageTranslationKey`
 * of the state by returning the warning message in the given action.
 *
 * @param state Input state to be altered.
 * @param action Action by which to alter state.
 * @return Unaltered state or browser warning string to be displayed or empty string.
 */
const browserWarningReducer = (state: any = null, action: ResetBrowserWarningAction | BrowserWarningAction) => {
  if (action.type === RESET_BROWSER_WARNING_ACTION) {
    return '';
  }

  const warning = _.get(action, 'payload.warning');

  if (warning) {
    return warning;
  }

  return state;
};

export default browserWarningReducer;
