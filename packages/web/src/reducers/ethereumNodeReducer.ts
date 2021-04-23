import {
  Action,
  SAGA_CHANGE_ETHEREUM_NODE_SUCCESS_ACTION,
  SAGA_FETCH_ETHEREUM_NODE_SUCCESS_ACTION,
  SAGA_RESET_ETHEREUM_NODE_SUCCESS_ACTION,
} from '../actions';

const initialState = { endpoint: '', isDefault: true };

const ethereumNodeReducer = (state: any = initialState, action: Action): any => {
  switch (action.type) {
    case SAGA_CHANGE_ETHEREUM_NODE_SUCCESS_ACTION:
      return { endpoint: action.payload.endpoint, isDefault: false };
    case SAGA_FETCH_ETHEREUM_NODE_SUCCESS_ACTION:
      return { endpoint: action.payload.endpoint, isDefault: action.payload.isDefault };
    case SAGA_RESET_ETHEREUM_NODE_SUCCESS_ACTION:
      return { endpoint: action.payload.endpoint, isDefault: true };
    default:
      return state;
  }
};

export default ethereumNodeReducer;
