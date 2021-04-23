import React, { FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import { CMR_TYPE_PDF } from '../../../actions';
import CMRAlertBox from '../../../components/CMRAlertBox';
import NavBar from '../../../components/NavBar';

import styles from './index.module.scss';

interface RouterProps {
  title: string;
}

interface PDFPageProps extends RouteComponentProps<RouterProps>, DispatchProps {}

interface DispatchProps {
  pushAction: (location: string) => void;
}

const mapDispatchToProps = {
  pushAction: push,
};

/**
 * This component implements the page containing the display of the first page of the eCMR document.
 *
 * @param pushAction Push action used for navigation between pages.
 */
const Index: FunctionComponent<PDFPageProps> = ({ pushAction }: PDFPageProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <NavBar pushAction={pushAction} />
      <div className={styles.contentWrapper}>
        <CMRAlertBox cmrType={CMR_TYPE_PDF} />
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

export default connect<any, DispatchProps, any>(null, mapDispatchToProps)(withRouter(Index));
