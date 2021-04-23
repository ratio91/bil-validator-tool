import React, { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import {
  changeEthereumNode as changeEthereumNodeAction,
  fetchEthereumNode as fetchEthereumNodeAction,
  resetEthereumNode as resetEthereumNodeAction,
} from '../../../actions';
import { RootReducerState } from '../../../reducers';
import { getEthereumNode, isDefaultEthereumNode } from '../../../reducers/selectors';

import styles from '../index.module.scss';

interface StateProps {
  ethereumNode: string;
  isDefaultNode: boolean;
}

interface DispatchProps {
  changeEthereumNode: (endpoint: string) => void;
  fetchEthereumNode: () => void;
  resetEthereumNode: () => void;
}

interface EthereumNodeFormProps extends StateProps, DispatchProps {}

const mapDispatchToProps = {
  changeEthereumNode: changeEthereumNodeAction,
  fetchEthereumNode: fetchEthereumNodeAction,
  resetEthereumNode: resetEthereumNodeAction,
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  ethereumNode: getEthereumNode(state),
  isDefaultNode: isDefaultEthereumNode(state),
});

const CustomEthereumNodeComponent: FunctionComponent<EthereumNodeFormProps> = ({
  changeEthereumNode,
  fetchEthereumNode,
  ethereumNode,
  isDefaultNode,
  resetEthereumNode,
}: EthereumNodeFormProps) => {
  const [currentEthereumNode, setEthereumNode] = useState(ethereumNode);

  useEffect(() => {
    fetchEthereumNode();
  }, [fetchEthereumNode]);

  useEffect(() => {
    setEthereumNode(ethereumNode);
  }, [ethereumNode]);

  const { t } = useTranslation('common');
  const [isCustomNodeAddress, setNodeAddressVisibility] = useState(!isDefaultNode);

  const additionalSettings = (
    <>
      <Row className={styles.row} sm={2} xs={1}>
        <Col className={styles.labelCol}>
          <h5>{t('Settings.CustomEthereumNode.nodeAddressPlaceholder')}</h5>
        </Col>
        <Col>
          <Form.Control
            className={styles.nodeAddrInput}
            type="text"
            placeholder={t('Settings.CustomEthereumNode.nodeAddressPlaceholder')}
            value={currentEthereumNode}
            onChange={(event: FormEvent<HTMLInputElement>) => {
              setEthereumNode(event.currentTarget.value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className={styles.btnCol}>
          <Button
            className={styles.btnChangeEndpoint}
            variant="secondary"
            onClick={() => {
              changeEthereumNode(currentEthereumNode);
            }}
          >
            {t('Settings.CustomEthereumNode.saveCustomNode')}
          </Button>
        </Col>
      </Row>
    </>
  );

  const handleCustomEthereumNodeClick = () => {
    setNodeAddressVisibility(!isCustomNodeAddress);
  };

  return (
    <>
      <Row className={styles.row} xs={2} sm={2}>
        <Col className={styles.labelCol} xs="auto" sm>
          <h5>{t('Settings.CustomEthereumNode.title')}</h5>
        </Col>
        <Col xs={1} sm>
          <input
            type="checkbox"
            checked={isCustomNodeAddress}
            onChange={() => {
              handleCustomEthereumNodeClick();
              if (isCustomNodeAddress) {
                resetEthereumNode();
              }
            }}
          />
        </Col>
      </Row>
      {isCustomNodeAddress && additionalSettings}
    </>
  );
};

export default connect<StateProps, DispatchProps, any, RootReducerState>(
  mapStateToProps,
  mapDispatchToProps,
)(CustomEthereumNodeComponent);
