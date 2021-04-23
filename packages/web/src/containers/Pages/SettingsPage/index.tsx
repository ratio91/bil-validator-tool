import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { useTranslation } from 'react-i18next';

import NavBar from '../../../components/NavBar';
import SettingsContainer from '../../../components/Settings';
import { getBrowserWarning, getChangeEthereumNodeSuccess, getErrorTranslationKey } from '../../../reducers/selectors';
import AlertBox from '../../../components/AlertBox';
import { RootReducerState } from '../../../reducers';
import { browserWarning as browserWarningAction } from '../../../actions';

import styles from './index.module.scss';

interface RouterProps {
  title: string;
}

interface SettingsProps extends StateProps, RouteComponentProps<RouterProps>, DispatchProps {}

interface StateProps {
  errorTranslationKey: any;
  browserWarning: any;
  changeNodeSuccess: boolean;
}

interface DispatchProps {
  pushAction: (location: string) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  dispatchBrowserWarning: (warning: string) => void;
}

const mapStateToProps = (state: RootReducerState): StateProps => ({
  errorTranslationKey: getErrorTranslationKey(state),
  browserWarning: getBrowserWarning(state),
  changeNodeSuccess: getChangeEthereumNodeSuccess(state),
});

const mapDispatchToProps = {
  pushAction: push,
  dispatchBrowserWarning: browserWarningAction,
};

/**
 * This Component implements the settings page, which is only available within the Electron
 * application. It allows to change language and set a custom Ethereum node.
 *
 * @param pushAction Push action used for navigation between pages.
 */
const SettingsPage: FunctionComponent<SettingsProps> = ({
  pushAction,
  errorTranslationKey,
  browserWarning,
  changeNodeSuccess,
}: SettingsProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <NavBar pushAction={pushAction} />
      <div className={styles.alertWrapper}>
        <AlertBox variant="warning" show={browserWarning} alertText={browserWarning} />
        <AlertBox variant="danger" show={errorTranslationKey} alertText={t(errorTranslationKey)} />
        <AlertBox variant="success" show={changeNodeSuccess} alertText={t('Ethereum.success')} />
      </div>
      <div className={styles.contentWrapper}>
        <SettingsContainer />
      </div>
    </>
  );
};

export default connect<any, DispatchProps, SettingsProps, RootReducerState>(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(SettingsPage));
