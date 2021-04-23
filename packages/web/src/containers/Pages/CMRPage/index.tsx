import React, { FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import { RootReducerState } from '../../../reducers';
import CMRDisplay from '../../../components/CMRDisplay';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CMRAlertBox from '../../../components/CMRAlertBox';
import NavBar from '../../../components/NavBar';
import { getCmr, getCmrType } from '../../../reducers/selectors';
import { EcmrDto } from '../../../dto/ecmr.dto';

import styles from './index.module.scss';

interface RouterProps {
  title: string;
}

interface CMRPageProps extends StateProps, RouteComponentProps<RouterProps>, DispatchProps {}

interface StateProps {
  cmr: EcmrDto;
  cmrType: string;
}

interface DispatchProps {
  pushAction: (location: string) => void;
}

const mapDispatchToProps = {
  pushAction: push,
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  cmr: getCmr(state),
  cmrType: getCmrType(state),
});

/**
 * This component implements the page containing the display of the first page of the eCMR document.
 *
 * @param cmr CMR document to display.
 * @param cmrType Printed or PDF as per `actions/index.ts`.
 * @param pushAction Push action used for navigation between pages.
 */
const Index: FunctionComponent<CMRPageProps> = ({ cmr, cmrType, pushAction }: CMRPageProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <NavBar pushAction={pushAction} />
      <div className={styles.contentWrapper}>
        <Breadcrumbs activePage="page1" pushAction={pushAction} />
        <CMRAlertBox cmrType={cmrType} />
      </div>
      <div className={styles.contentWrapper}>
        <CMRDisplay cmrData={cmr} />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.buttonNav}>
          <Button variant="secondary" onClick={() => pushAction('/new-validation')}>
            {t('backButtonLabel')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default connect<StateProps, any, any, RootReducerState>(mapStateToProps, mapDispatchToProps)(withRouter(Index));
