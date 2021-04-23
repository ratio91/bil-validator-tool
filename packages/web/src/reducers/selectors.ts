import { RootReducerState } from './index';

export const getCmr = (state: RootReducerState) => state.cmr;

export const getCmrType = (state: RootReducerState) => state.cmrType;

export const getErrorTranslationKey = (state: RootReducerState) => state.errorTranslationKey;

export const getBrowserWarning = (state: RootReducerState) => state.browserWarning;

export const getEthereumNode = (state: RootReducerState) => state.ethereumNode.endpoint;

export const isDefaultEthereumNode = (state: RootReducerState) => state.ethereumNode.isDefault;

export const getChangeEthereumNodeSuccess = (state: RootReducerState) => state.status;
