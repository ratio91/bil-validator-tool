import axios from 'axios';

import { withoutTrailingSlashes } from '../utils/urlParser';

import { backendUrl } from '../config';
import { isElectronApp } from '../utils/executionContextUtils';

/**
 * Async function for fetching an eCMR by its ID (CMR-No.) and PIN using the ValidatorTool
 * backend from package `api`.
 *
 * @param id CMR-No.
 * @param pin Pin-Code.
 * @return Returns the successfully fetched eCMR from the backend or in case of an error the
 * translation key of the appropriate error message to display.
 */
export const requestCmr = async (id: string, pin: string) => {
  try {
    const response = await axios.post(`${withoutTrailingSlashes(backendUrl)}/ecmr`, { id, pin });
    return { cmr: response.data[0] };
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return { error: 'NewValidation.Errors.IdPin.badRequest' };
        case 401:
          return { error: 'NewValidation.Errors.wrongIdOrPinCode' };
        case 403:
          return { error: 'NewValidation.Errors.requestLimitReached' };
        case 404:
          return { error: 'NewValidation.Errors.unexpected' };
        case 422:
          return { error: 'NewValidation.Errors.hashMismatch' };
        case 426:
          return isElectronApp
            ? { error: 'NewValidation.Errors.unknownCompanyID' }
            : { error: 'NewValidation.Errors.unexpected' };
        default:
          return { error: `NewValidation.Errors.unexpected` };
      }
    }
    return { error: 'NewValidation.Errors.unexpected' };
  }
};

/**
 * Async function for fetching and validating a eCMR by a given eCMR PDF file using the
 * ValidatorTool backend from package `api`.
 *
 * @param {File} file eCMR as PDF file.
 * @return {boolean} true if pdfHash found on blockchain
 */
export const requestCmrByPdf = async (file: File) => {
  try {
    const data = new FormData();
    data.append('file', file);
    const res = await axios.post(`${withoutTrailingSlashes(backendUrl)}/ecmr/upload`, data, {});
    return { res };
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return { error: 'NewValidation.Errors.Pdf.badRequest' };
        case 401:
          return { error: 'NewValidation.Errors.wrongIdOrPinCode' };
        case 403:
          return { error: 'NewValidation.Errors.requestLimitReached' };
        case 404:
          return { error: 'NewValidation.Errors.unexpected' };
        case 422:
          return { error: 'NewValidation.Errors.hashMismatch' };
        case 426:
          return isElectronApp
            ? { error: 'NewValidation.Errors.unknownCompanyID' }
            : { error: 'NewValidation.Errors.unexpected' };
        default:
          return { error: `NewValidation.Errors.unexpected` };
      }
    }
    return { error: 'NewValidation.Errors.unexpected' };
  }
};
