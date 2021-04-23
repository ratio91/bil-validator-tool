import React, { FunctionComponent } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'react-bootstrap';

import { CMR_TYPE_PDF, CMR_TYPE_PRINT } from '../../actions';

import styles from './index.module.scss';

type CMRAlertProps = {
  cmrType: string;
};

/**
 * This Alert box component is meant to be shown on the first (`CMRPage`) and second
 * (`MetadataPage`) CMR page and to inform the user whether the validation was successful or not
 * or to inform the user about comparing the printed CMR with the displayed CMR manually.
 *
 * @param cmrType cmrType Printed or PDF as per `actions/index.ts`.
 */
const CMRAlertBox: FunctionComponent<CMRAlertProps> = ({ cmrType }: CMRAlertProps) => {
  const { t } = useTranslation('common');

  let alertVariant: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'dark' | 'light' = 'danger';
  let alertMessage = t('CMRAlert.Invalid.alertMessage');
  let alertSymbol = 10007; // Error-Symbol in hex
  let alertSubtext = '';

  if (cmrType === CMR_TYPE_PRINT) {
    alertVariant = 'warning';
    alertMessage = t('CMRAlert.ManualCheck.alertMessage');
    alertSubtext = t('CMRAlert.ManualCheck.subMessage');
    alertSymbol = 33; // Exclamaition Mark in hex
  } else if (cmrType === CMR_TYPE_PDF) {
    alertSymbol = 10003; // Check Mark in hex
    alertVariant = 'success';
    alertMessage = t('CMRAlert.Valid.alertMessage');
    alertSubtext = t('CMRAlert.Valid.subMessage');
  }

  return (
    <Alert variant={alertVariant}>
      <Container fluid>
        <Row className={styles.row}>
          <Col sm="auto">
            <div className={styles.alertSymbol}>{String.fromCharCode(alertSymbol)}</div>
          </Col>
          <Col>
            <div className={styles.alertText}>{alertMessage}</div>
            <div className={styles.alertSubtext}>{alertSubtext}</div>
          </Col>
        </Row>
      </Container>
    </Alert>
  );
};

export default CMRAlertBox;
