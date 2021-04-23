import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Button from 'react-bootstrap/Button';
import { RouteComponentProps, withRouter } from 'react-router';
import { Col, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faEyeSlash, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';

import { RootReducerState } from '../../reducers';
import { fetchCMR as fetchCMRAction } from '../../actions';

import styles from './index.module.scss';

interface DispatchProps {
  fetchCMR: (id: string, pin: string) => void;
}

interface IdPinFormProps extends RouteComponentProps, DispatchProps {}

const mapDispatchToProps = {
  fetchCMR: fetchCMRAction,
};

function parseIdAndPin(hash: string) {
  const split = hash.substr(1).split('-');

  if (split.length === 2) return { initialId: split[0], initialPin: split[1] };

  return { initialId: '', initialPin: '' };
}

/**
 * This component implements a form for input of CMR No. (ID) and its Pin-Code (PIN). Upon
 * clicking the "Next" button, a `fetchCMRAction` is dispatched.
 *
 * @param fetchCMR Action creator for triggering the fetching of a CMR.
 * @param location When using the QR-Code on the CMR, contains ID and PIN.
 */
const IdPinForm: FunctionComponent<IdPinFormProps> = ({ fetchCMR, location }: IdPinFormProps) => {
  const { t } = useTranslation('common');

  const { initialId, initialPin } = parseIdAndPin(location.hash);

  const [id, setId] = useState(initialId);
  const [pin, setPin] = useState(initialPin);
  const [passwordVisible, setPasswordVisibility] = useState(false);

  useEffect(() => {
    setId(initialId);
    setPin(initialPin);

    if (initialId !== '' && initialPin !== '') {
      fetchCMR(initialId, initialPin);
    }
  }, [initialId, initialPin, fetchCMR]);

  const controlChangedHandler = (setter: Dispatch<SetStateAction<string>>) => (
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    setter(event.currentTarget.value);
  };

  function renderIdToolTip(props: any) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Tooltip id="info-tooltip" {...props}>
        {t('NewValidation.IdPinForm.cmrNoToolTip')}
      </Tooltip>
    );
  }

  function renderPinToolTip(props: any) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Tooltip id="info-tooltip" {...props}>
        {t('NewValidation.IdPinForm.pinToolTip')}
      </Tooltip>
    );
  }

  const displayPasswordClickHandler = (
    passwordVisibility: boolean,
    setter: Dispatch<SetStateAction<boolean>>,
  ): void => {
    setter(!passwordVisibility);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <Form>
        <Form.Group as={Form.Row}>
          <Form.Label column sm="auto">
            <div className={styles.formLabel}>
              {t('NewValidation.IdPinForm.cmrNoLabel').concat(' ')}
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderIdToolTip}
                trigger={['hover', 'click', 'focus']}
              >
                <sup className={styles.light}>
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </sup>
              </OverlayTrigger>
            </div>
          </Form.Label>
          <Col>
            <Form.Control
              value={id}
              onChange={controlChangedHandler(setId)}
              type="text"
              placeholder={t('NewValidation.IdPinForm.cmrNoPlaceholder')}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Form.Row}>
          <Form.Label column sm="auto">
            <div className={styles.formLabel}>
              {t('NewValidation.IdPinForm.pinLabel').concat(' ')}
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderPinToolTip}
                trigger={['hover', 'click', 'focus']}
              >
                <sup className={styles.light}>
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </sup>
              </OverlayTrigger>
            </div>
          </Form.Label>
          <Col>
            <InputGroup>
              <Form.Control
                value={pin}
                onChange={controlChangedHandler(setPin)}
                type="text"
                className={passwordVisible || _.isEmpty(pin) ? '' : styles.hide}
                placeholder={t('NewValidation.IdPinForm.pinPlaceholder')}
              />
              <InputGroup.Append>
                <Button
                  className={styles.inputShowPasswordButton}
                  variant="secondary"
                  onClick={() => {
                    displayPasswordClickHandler(passwordVisible, setPasswordVisibility);
                  }}
                >
                  {passwordVisible ? (
                    <FontAwesomeIcon className={styles.inputShowPasswordButtonIcon} icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon className={styles.inputShowPasswordButtonIcon} icon={faEye} />
                  )}
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Form.Group>
        <div className={styles.nextButtonContainer}>
          <Button
            onClick={() => {
              fetchCMR(id, pin);
            }}
            variant="secondary"
          >
            {t('nextButtonLabel')}
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default connect<any, DispatchProps, any, RootReducerState>(null, mapDispatchToProps)(withRouter(IdPinForm));
