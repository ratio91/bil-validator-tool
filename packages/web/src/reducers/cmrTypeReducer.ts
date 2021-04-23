import { CMR_TYPE_PRINT, SAGA_FETCH_CMR_SUCCESS_ACTION, SagaFetchCMRSuccessAction } from '../actions';

/**
 * Catches actions of type `SagaFetchCMRSuccessAction` to set `cmrType` of state to right type
 * (printed of PDF).
 *
 * @param state Input state to be altered.
 * @param action Action by which to alter state.
 * @return Unaltered state or type of successfully fetched CMR.
 */
const cmrTypeReducer = (state = CMR_TYPE_PRINT, action: SagaFetchCMRSuccessAction): string => {
  switch (action.type) {
    case SAGA_FETCH_CMR_SUCCESS_ACTION:
      return action.payload.requestType;
    default:
      return state;
  }
};

export default cmrTypeReducer;
