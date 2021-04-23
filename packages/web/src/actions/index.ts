import { LocationChangeAction } from 'connected-react-router';
import { AnyAction } from 'redux';
import { EcmrDto } from '../dto/ecmr.dto';

/**
 * RESET_ERROR_MESSAGE_ACTION
 */
export const RESET_ERROR_MESSAGE_ACTION = 'RESET_ERROR_MESSAGE_ACTION';

/**
 * Is dispatched when the state's `errorMessageTranslationKey` is to be emptied, e.g., after
 * dismissing the error message alert box or after a successful eCMR retrieval.
 */
export class ResetErrorMessageAction {
  readonly type = RESET_ERROR_MESSAGE_ACTION;

  constructor(public payload: { error?: string } = {}) {}
}

export const resetErrorMessage = (): ResetErrorMessageAction => new ResetErrorMessageAction({});

/**
 * BROWSER_WARNING_ACTION
 */
export const BROWSER_WARNING_ACTION = 'BROWSER_WARNING_ACTION';

/**
 * Is dispatched when the state's `browserWarning` is to be set.
 */
export class BrowserWarningAction {
  readonly type = BROWSER_WARNING_ACTION;

  constructor(public payload: { warning?: string } = {}) {}
}

export const browserWarning = (warning: string): BrowserWarningAction => new BrowserWarningAction({ warning });

/**
 * RESET_BROWSER_WARNING_ACTION
 */
export const RESET_BROWSER_WARNING_ACTION = 'RESET_BROWSER_WARNING_ACTION';

/**
 * Is dispatched when state's `browserWarning` is to be emptied, e.g., after dismissing the
 * browser warning alert box.
 */
export class ResetBrowserWarningAction {
  readonly type = RESET_BROWSER_WARNING_ACTION;

  constructor(public payload: { warning?: string } = {}) {}
}

export const resetBrowserWarning = (): ResetBrowserWarningAction => new ResetBrowserWarningAction({});

/**
 * FETCH_CMR_ACTION
 */
export const FETCH_CMR_ACTION = 'FETCH_CMR_ACTION';

/**
 * Is dispatched when CMR shall be fetched by ID and PIN. Is caught by saga to asynchronously
 * fetch CMR via the backend.
 */
export class FetchCMRAction {
  readonly type = FETCH_CMR_ACTION;

  constructor(public payload: { id: string; pin: string }) {}
}

export const fetchCMR = (id: string, pin: string): FetchCMRAction => new FetchCMRAction({ id, pin });

/**
 * FETCH_CMR_PDF_ACTION
 */
export const FETCH_CMR_PDF_ACTION = 'FETCH_CMR_PDF_ACTION';

/**
 * Is dispatched when CMR shall be fetched by given CMR as PDF file. Is caught by saga to
 * asynchronously fetch CMR via the backend.
 */
export class FetchCMRByPdfAction {
  readonly type = FETCH_CMR_PDF_ACTION;

  constructor(public payload: { file: File }) {}
}

export const fetchCMRByPdf = (file: File): FetchCMRByPdfAction => new FetchCMRByPdfAction({ file });

/**
 * SAGA_FETCH_CMR_ACTIONS
 */
export const SAGA_FETCH_CMR_REQUEST_ACTION = 'SAGA_FETCH_CMR_REQUEST_ACTION';
export const SAGA_FETCH_CMR_SUCCESS_ACTION = 'SAGA_FETCH_CMR_SUCCESS_ACTION';
export const SAGA_FETCH_PDF_SUCCESS_ACTION = 'SAGA_FETCH_PDF_SUCCESS_ACTION';
export const SAGA_FETCH_CMR_FAILURE_ACTION = 'SAGA_FETCH_CMR_FAILURE_ACTION';

export const SAGA_FETCH_CMR_PDF_REQUEST_ACTION = 'SAGA_FETCH_CMR_PDF_REQUEST_ACTION';

export const CMR_TYPE_PRINT = 'CMR_TYPE_PRINT';
export const CMR_TYPE_PDF = 'CMR_TYPE_PDF';

/**
 * Dispatched by CMR saga, caught by `statusReducer` to update state's `status`.
 */
export class SagaFetchCMRRequestAction {
  readonly type = SAGA_FETCH_CMR_REQUEST_ACTION;

  constructor(public payload: any = {}) {}
}

/**
 * Dispatched by CMR saga. Caught by `cmrReducer` to put fetched CMR data into state's `cmr`.
 * Caught by `cmrTypeReducer` to set state's `cmrType` (printed or pdf). Caught by
 * `statusReducer` to update state's `status`.
 */
export class SagaFetchCMRSuccessAction {
  readonly type = SAGA_FETCH_CMR_SUCCESS_ACTION;

  constructor(public payload: { cmr: EcmrDto; requestType: string }) {}
}

export class SagaFetchPdfSuccessAction {
  readonly type = SAGA_FETCH_PDF_SUCCESS_ACTION;
}

/**
 * Dispatched by CMR saga, caught by `statusReducer` to update state's `status`.
 */
export class SagaFetchCMRFailureAction {
  readonly type = SAGA_FETCH_CMR_FAILURE_ACTION;

  constructor(public payload: { error: string }) {}
}

export class SagaFetchCMRByPdfRequestAction {
  readonly type = SAGA_FETCH_CMR_PDF_REQUEST_ACTION;

  constructor(public payload: any = {}) {}
}

/**
 * FETCH_ETHEREUM_NODE_ACTION
 */
export const FETCH_ETHEREUM_NODE_ACTION = 'FETCH_ETHEREUM_NODE_ACTION';

/**
 * Is dispatched when current ethereum node shall be fetched. Is caught by saga to asynchronously
 * fetch node from the backend.
 */
export class FetchEthereumNodeAction {
  readonly type = FETCH_ETHEREUM_NODE_ACTION;

  constructor(public payload: any = {}) {}
}

export const fetchEthereumNode = (): FetchEthereumNodeAction => new FetchEthereumNodeAction();

/**
 * CHANGE_ETHEREUM_NODE_ACTION
 */
export const CHANGE_ETHEREUM_NODE_ACTION = 'CHANGE_ETHEREUM_NODE_ACTION';

/**
 * Is dispatched when ethereum node shall be changed. Is caught by saga to asynchronously
 * set node on the backend.
 */
export class ChangeEthereumNodeAction {
  readonly type = CHANGE_ETHEREUM_NODE_ACTION;

  constructor(public payload: { endpoint: string }) {}
}

export const changeEthereumNode = (endpoint: string): ChangeEthereumNodeAction =>
  new ChangeEthereumNodeAction({ endpoint });

/**
 * RESET_ETHEREUM_NODE_ACTION
 */
export const RESET_ETHEREUM_NODE_ACTION = 'RESET_ETHEREUM_NODE_ACTION';

export class ResetEthereumNodeAction {
  readonly type = RESET_ETHEREUM_NODE_ACTION;

  constructor(public payload: any = {}) {}
}

export const resetEthereumNode = (): ResetEthereumNodeAction => new ResetEthereumNodeAction();

/**
 * SAGA_FETCH_ETHEREUM_NODE_ACTIONS
 */
export const SAGA_FETCH_ETHEREUM_NODE_REQUEST_ACTION = 'SAGA_FETCH_ETHEREUM_NODE_REQUEST_ACTION';
export const SAGA_FETCH_ETHEREUM_NODE_SUCCESS_ACTION = 'SAGA_FETCH_ETHEREUM_NODE_SUCCESS_ACTION';
export const SAGA_FETCH_ETHEREUM_NODE_FAILURE_ACTION = 'SAGA_FETCH_ETHEREUM_NODE_FAILURE_ACTION';

/**
 * Dispatched by saga when ethereum node is fetch request is sent.
 */
export class SagaFetchEthereumNodeRequestAction {
  readonly type = SAGA_FETCH_ETHEREUM_NODE_REQUEST_ACTION;

  constructor(public payload: any = {}) {}
}

/**
 * Dispatched by saga when ethereum node was successfully fetched. Caught by fetchEthereumNodeReducer.
 */
export class SagaFetchEthereumNodeSuccessAction {
  readonly type = SAGA_FETCH_ETHEREUM_NODE_SUCCESS_ACTION;

  constructor(public payload: { endpoint: string; isDefault: boolean }) {}
}

/**
 * Dispatched by saga, caught by `errorReducer` to update error state.
 */
export class SagaFetchEthereumNodeFailureAction {
  readonly type = SAGA_FETCH_ETHEREUM_NODE_FAILURE_ACTION;

  constructor(public payload: { error: string }) {}
}

/**
 * SAGA_CHANGE_ETHEREUM_NODE_ACTIONS
 */
export const SAGA_CHANGE_ETHEREUM_NODE_REQUEST_ACTION = 'SAGA_CHANGE_ETHEREUM_NODE_REQUEST_ACTION';
export const SAGA_CHANGE_ETHEREUM_NODE_SUCCESS_ACTION = 'SAGA_CHANGE_ETHEREUM_NODE_SUCCESS_ACTION';
export const SAGA_CHANGE_ETHEREUM_NODE_FAILURE_ACTION = 'SAGA_CHANGE_ETHEREUM_NODE_FAILURE_ACTION';

/**
 * Dispatched by saga when ethereum node is change request is sent.
 */
export class SagaChangeEthereumNodeRequestAction {
  readonly type = SAGA_CHANGE_ETHEREUM_NODE_REQUEST_ACTION;

  constructor(public payload: any = {}) {}
}

/**
 * Dispatched by saga when ethereum node was successfully changed. Caught by changeEthereumNodeReducer.
 */
export class SagaChangeEthereumNodeSuccessAction {
  readonly type = SAGA_CHANGE_ETHEREUM_NODE_SUCCESS_ACTION;

  constructor(public payload: { endpoint: string }) {}
}

/**
 * Dispatched by saga, caught by `errorReducer` to update error state.
 */
export class SagaChangeEthereumNodeFailureAction {
  readonly type = SAGA_CHANGE_ETHEREUM_NODE_FAILURE_ACTION;

  constructor(public payload: { error: string }) {}
}

/**
 * SAGA_RESET_ETHEREUM_NODE_ACTIONS
 */

export const SAGA_RESET_ETHEREUM_NODE_FAILURE_ACTION = 'SAGA_RESET_ETHEREUM_NODE_FAILURE_ACTION';
export const SAGA_RESET_ETHEREUM_NODE_SUCCESS_ACTION = 'SAGA_RESET_ETHEREUM_NODE_SUCCESS_ACTION';

export class SagaResetEthereumNodeSuccessAction {
  readonly type = SAGA_RESET_ETHEREUM_NODE_SUCCESS_ACTION;

  constructor(public payload: { endpoint: string }) {}
}

export class SagaResetEthereumNodeFailureAction {
  readonly type = SAGA_RESET_ETHEREUM_NODE_FAILURE_ACTION;

  constructor(public payload: { error: string }) {}
}

/**
 * export all types
 */
export type Action =
  | AnyAction
  | FetchCMRAction
  | FetchCMRByPdfAction
  | ResetErrorMessageAction
  | LocationChangeAction
  | SagaFetchCMRRequestAction
  | SagaFetchCMRSuccessAction
  | SagaFetchPdfSuccessAction
  | SagaFetchCMRFailureAction
  | SagaFetchCMRByPdfRequestAction
  | ChangeEthereumNodeAction
  | SagaChangeEthereumNodeRequestAction
  | SagaChangeEthereumNodeSuccessAction
  | SagaChangeEthereumNodeFailureAction
  | FetchEthereumNodeAction
  | SagaFetchEthereumNodeRequestAction
  | SagaFetchEthereumNodeSuccessAction
  | SagaFetchEthereumNodeFailureAction
  | SagaResetEthereumNodeSuccessAction
  | SagaResetEthereumNodeFailureAction;
