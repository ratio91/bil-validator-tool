import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { detect } from 'detect-browser';

import NavBar from '../../../components/NavBar';
import ValidatePdfContainer from './ValidatePdf';
import ValidatePrintedContainer from './ValidatePrinted';
import { getBrowserWarning, getErrorTranslationKey } from '../../../reducers/selectors';
import { RootReducerState } from '../../../reducers';
import AlertBox from '../../../components/AlertBox';
import { BrowserCompatibilityError, isBrowserSupported } from '../../../utils/browserCompatibility';
import { browserWarning as browserWarningAction } from '../../../actions';

import styles from './index.module.scss';

interface RouterProps {
  title: string;
}

interface NewValidationProps extends StateProps, RouteComponentProps<RouterProps>, DispatchProps {}

interface StateProps {
  errorTranslationKey: any;
  browserWarning: any;
}

interface DispatchProps {
  pushAction: (location: string) => void;
  dispatchBrowserWarning: (warning: string) => void;
}

const mapStateToProps = (state: RootReducerState): StateProps => ({
  errorTranslationKey: getErrorTranslationKey(state),
  browserWarning: getBrowserWarning(state),
});

const mapDispatchToProps = {
  pushAction: push,
  dispatchBrowserWarning: browserWarningAction,
};

/**
 * This Component implements the "home page" where eCMR-PDF can be uploaded and CMR-No. +
 * Pin-Code can be entered for validation. Unless the states variable `browserWarning` has not
 * already been dismissed, that is set to the empty string, then also checks for browser
 * compatibility and displays browser warning in case of (potential) incompatibility.
 *
 * @param errorTranslationKey Translation key of error message to display. Shall be empty if
 * none is to be displayed.
 * @param browserWarning Browser warning message. Shall be empty if none is to be displayed.
 * @param pushAction Push action used for navigation between pages.
 * @param dispatchBrowserWarning Action that triggers the setting of the browser warning
 * containing variable `browserWaring` in the state.
 */
const NewValidation: FunctionComponent<NewValidationProps> = ({
  errorTranslationKey,
  browserWarning,
  pushAction,
  dispatchBrowserWarning,
}: NewValidationProps) => {
  const { t } = useTranslation('common');

  if (browserWarning !== '') {
    const browser = detect();
    const browserCompatibility = isBrowserSupported(browser);
    let browserCompatibilityErrorMessage = '';

    if (
      browserCompatibility.errorMessage &&
      browserCompatibility.errorMessage === BrowserCompatibilityError.UNSUPPORTED_BROWSER
    ) {
      browserCompatibilityErrorMessage = t('unsupportedBrowserAlert');
      dispatchBrowserWarning(browserCompatibilityErrorMessage);
    } else if (!browserCompatibility.compatible) {
      browserCompatibilityErrorMessage = t('outdatedBrowserAlert', {
        browser: browserCompatibility.browserName,
      });
      dispatchBrowserWarning(browserCompatibilityErrorMessage);
    }
  }
  return (
    <>
      <NavBar pushAction={pushAction} />

      <div className={styles.alertWrapper}>
        <AlertBox variant="warning" show={!_.isEmpty(browserWarning)} alertText={browserWarning} />
        <AlertBox variant="danger" show={!_.isEmpty(errorTranslationKey)} alertText={t(errorTranslationKey)} />
      </div>

      <div className={styles.contentWrapper}>
        <ValidatePdfContainer />
      </div>

      <p className={styles.orSeparator}>
        <span>{t('orLabel')}</span>
      </p>

      <div className={styles.contentWrapper}>
        <ValidatePrintedContainer pushAction={pushAction} />
      </div>
    </>
  );
};

export default connect<StateProps, DispatchProps, NewValidationProps, RootReducerState>(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(NewValidation));
