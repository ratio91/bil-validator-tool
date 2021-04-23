import { SAGA_FETCH_CMR_SUCCESS_ACTION, SagaFetchCMRSuccessAction } from '../actions';

/**
 * Catches actions of type `SagaFetchCMRSuccessAction` to set `cmr` of state to fetched CMR data.
 *
 * @param state Input state to be altered.
 * @param action Action by which to alter state.
 * @return Unaltered state or successfully fetched CMR.
 */
const cmrReducer = (state: any = null, action: SagaFetchCMRSuccessAction): any => {
  switch (action.type) {
    case SAGA_FETCH_CMR_SUCCESS_ACTION:
      return action.payload.cmr;
    default:
      return state;
  }
};

export default cmrReducer;
