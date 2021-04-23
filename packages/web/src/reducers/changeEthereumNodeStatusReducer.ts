import { Action, RESET_ERROR_MESSAGE_ACTION, SAGA_CHANGE_ETHEREUM_NODE_SUCCESS_ACTION } from '../actions';

const changeEthereumNodeStatusReducer = (state = false, action: Action) => {
  switch (action.type) {
    case SAGA_CHANGE_ETHEREUM_NODE_SUCCESS_ACTION:
      return true;
    case RESET_ERROR_MESSAGE_ACTION:
      return false;
    default:
      return state;
  }
};

export default changeEthereumNodeStatusReducer;
