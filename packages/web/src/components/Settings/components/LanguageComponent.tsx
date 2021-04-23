import React, { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import LanguagePicker from '../../LanguageSelector/LanguagePicker';

import styles from '../index.module.scss';

const LanguageComponent: FunctionComponent = () => {
  const { t } = useTranslation('common');

  return (
    <Row className={styles.row}>
      <Col className={styles.labelCol} xs="auto" sm>
        <h5>{t('Settings.Language.title')}</h5>
      </Col>
      <Col xs={8} sm>
        <LanguagePicker showLabels />
      </Col>
    </Row>
  );
};

export default LanguageComponent;
