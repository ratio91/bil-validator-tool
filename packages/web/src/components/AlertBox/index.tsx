import React, { FunctionComponent } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Col, Container, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { faExclamation, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { resetBrowserWarning, resetErrorMessage } from '../../actions';
import { RootReducerState } from '../../reducers';

import styles from './index.module.scss';

interface AlertProps extends DispatchProps {
  alertText: string;
  show?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
}

interface DispatchProps {
  dismissBrowserWarning: () => void;
  dismissErrorMessage: () => void;
}

const mapDispatchToProps = {
  dismissBrowserWarning: resetBrowserWarning,
  dismissErrorMessage: resetErrorMessage,
};

/**
 * Displays error or warning text while being dismissible.
 *
 * @param alertText Main text to display.
 * @param show Whether to be visible.
 * @param variant 'danger' is red, 'warning' is yellow.
 * @param dismissBrowserWarning Action dispatcher with which to dismiss alert box, i.e., to empty
 * browser warning variable from state.
 * @param dismissErrorMessage Action dispatcher with which to dismiss alert box, i.e., to empty
 * error message variable from state.
 */
const AlertBox: FunctionComponent<AlertProps> = ({
  alertText,
  show,
  variant,
  dismissBrowserWarning,
  dismissErrorMessage,
}: AlertProps) => {
  let alertIcon;

  switch (variant) {
    case 'danger':
      alertIcon = faExclamation;
      break;
    case 'warning':
      alertIcon = faExclamationTriangle;
      break;
    default:
      alertIcon = faInfoCircle;
      break;
  }

  return (
    <Alert
      variant={variant}
      show={show}
      dismissible
      onClose={() => {
        if (variant === 'danger' || variant === 'success') {
          dismissErrorMessage();
        } else {
          dismissBrowserWarning();
        }
      }}
    >
      <Container fluid>
        <Row className={styles.row}>
          <Col sm="auto">
            <div className={styles.alertSymbol}>
              <FontAwesomeIcon icon={alertIcon} />
            </div>
          </Col>
          <Col>
            <div className={styles.alertText}>{alertText}</div>
          </Col>
        </Row>
      </Container>
    </Alert>
  );
};

export default connect<any, DispatchProps, any, RootReducerState>(null, mapDispatchToProps)(AlertBox);
