import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { requestCmr, requestCmrByPdf } from '../services/cmrRestApi';
import { changeEthereumNode, fetchEthereumNode, resetEthereumNode } from '../services/ethereumRestApi';

import {
  CHANGE_ETHEREUM_NODE_ACTION,
  ChangeEthereumNodeAction,
  CMR_TYPE_PRINT,
  FETCH_CMR_ACTION,
  FETCH_CMR_PDF_ACTION,
  FETCH_ETHEREUM_NODE_ACTION,
  FetchCMRAction,
  FetchCMRByPdfAction,
  RESET_ETHEREUM_NODE_ACTION,
  ResetErrorMessageAction,
  SagaChangeEthereumNodeFailureAction,
  SagaChangeEthereumNodeRequestAction,
  SagaChangeEthereumNodeSuccessAction,
  SagaFetchCMRByPdfRequestAction,
  SagaFetchCMRFailureAction,
  SagaFetchCMRRequestAction,
  SagaFetchCMRSuccessAction,
  SagaFetchPdfSuccessAction,
  SagaFetchEthereumNodeFailureAction,
  SagaFetchEthereumNodeRequestAction,
  SagaFetchEthereumNodeSuccessAction,
  SagaResetEthereumNodeFailureAction,
  SagaResetEthereumNodeSuccessAction,
} from '../actions';

/**
 *  SUBROUTINES
 */

/**
 * This generator takes `FetchCMRAction`s that have been dispatched in a React component and
 * asynchronously fetches the eCMR with the ID and PIN delivered within the action using the
 * backend service. Yields the eCMR in a `SagaFetchCMRSuccessAction` and empties the error
 * message state (in case there has been errors earlier) on success and yields a
 * `SagaFetchCMRFailureAction` along with an error message on failure.
 *
 * @param id eCMR No.
 * @param pin eCMR Pin-Code
 */
function* fetchCMRSaga({ payload: { id, pin } }: FetchCMRAction) {
  yield put(new SagaFetchCMRRequestAction());

  const { cmr, error } = yield call(requestCmr, id, pin);

  if (cmr) {
    yield put(new SagaFetchCMRSuccessAction({ cmr, requestType: CMR_TYPE_PRINT }));
    yield put(new ResetErrorMessageAction());
    yield put(push(`/cmr`));
  } else {
    yield put(new SagaFetchCMRFailureAction({ error }));
  }
}

/**
 * This generator takes `FetchCMRByPdfAction`s that have been dispatched in a React component and
 * asynchronously fetches the eCMR that matches the ID/PIN delivered within the file within the
 * action using the
 * backend service. Yields the eCMR in a `SagaFetchCMRSuccessAction` and empties the error
 * message state (in case there has been errors earlier) on success and yields a
 * `SagaFetchCMRFailureAction` along with an error message on failure.
 *
 * @param file eCMR document PDF file.
 */
function* fetchCMRByPdfSaga({ payload: { file } }: FetchCMRByPdfAction) {
  yield put(new SagaFetchCMRByPdfRequestAction());

  const { res, error } = yield call(requestCmrByPdf, file);

  if (res) {
    yield put(new SagaFetchPdfSuccessAction());
    yield put(new ResetErrorMessageAction());
    yield put(push(`/pdf`));
  } else {
    yield put(new SagaFetchCMRFailureAction({ error }));
  }
}

/**
 * This generator takes `FetchEthereumNodeAction`s that have been dispatched in a React component and
 * asynchronously fetches the current Ethereum Node from the backend service. Yields the node in a
 * `SagaFetchEthereumNodeSuccessAction` or yields a
 * `SagaFetchEthereumNodeFailureAction` along with an error message on failure.
 */
function* fetchEthereumNodeSaga() {
  yield put(new SagaFetchEthereumNodeRequestAction());

  const { endpoint, error } = yield call(fetchEthereumNode);
  if (endpoint) {
    yield put(
      new SagaFetchEthereumNodeSuccessAction({
        endpoint: endpoint.ethereumNode,
        isDefault: endpoint.isDefault,
      }),
    );
  } else {
    yield put(new SagaFetchEthereumNodeFailureAction({ error }));
  }
}

function* resetEthereumNodeSaga() {
  const { endpoint, error } = yield call(resetEthereumNode);
  if (endpoint) {
    yield put(
      new SagaResetEthereumNodeSuccessAction({
        endpoint: endpoint.ethereumNode,
      }),
    );
  } else {
    yield put(new SagaResetEthereumNodeFailureAction({ error }));
  }
}

/**
 * This generator takes `ChangeEthereumNodeAction`s that have been dispatched in a React component and
 * asynchronously sets the ethereum Node in the backend service. Yields the node in a
 * `SagaChangeEthereumNodeSuccessAction` or yields a
 * `SagaChangeEthereumNodeFailureAction` along with an error message on failure.
 *
 * @param endpoint new Ethereum Node
 */
function* changeEthereumNodeSaga({ payload: { endpoint } }: ChangeEthereumNodeAction) {
  yield put(new SagaChangeEthereumNodeRequestAction());

  const { newEndpoint, error } = yield call(changeEthereumNode, endpoint);

  if (newEndpoint) {
    yield put(new ResetErrorMessageAction());
    yield put(new SagaChangeEthereumNodeSuccessAction({ endpoint: newEndpoint }));
  } else {
    yield put(new SagaChangeEthereumNodeFailureAction({ error }));
  }
}

/**
 *  WATCHERS
 */

function* watchFetchCMRSaga() {
  yield takeEvery(FETCH_CMR_ACTION, fetchCMRSaga);
}

function* watchFetchCMRByPdfSaga() {
  yield takeEvery(FETCH_CMR_PDF_ACTION, fetchCMRByPdfSaga);
}

function* watchFetchEthereumNodeSaga() {
  yield takeEvery(FETCH_ETHEREUM_NODE_ACTION, fetchEthereumNodeSaga);
}

function* watchChangeEthereumNodeSaga() {
  yield takeEvery(CHANGE_ETHEREUM_NODE_ACTION, changeEthereumNodeSaga);
}

function* watchResetEthereumNodeSaga() {
  yield takeEvery(RESET_ETHEREUM_NODE_ACTION, resetEthereumNodeSaga);
}

/**
 *  EXPORTS
 */

export default function* rootSaga() {
  yield all([
    fork(watchFetchCMRSaga),
    fork(watchFetchCMRByPdfSaga),
    fork(watchChangeEthereumNodeSaga),
    fork(watchFetchEthereumNodeSaga),
    fork(watchResetEthereumNodeSaga),
  ]);
}
