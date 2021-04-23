import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';

import { ReferenceDto } from '../../../dto/reference.dto';

import styles from '../index.module.scss';

type ReferencesProps = {
  references: ReferenceDto;
};

const References: FunctionComponent<ReferencesProps> = ({ references }: ReferencesProps) => {
  const { t } = useTranslation('common');
  const referenceNames: (keyof ReferenceDto)[] = [
    'carrier',
    'consignee',
    'forwarder',
    'principal',
    'sender',
    'shipper',
    'successives',
    'unloader',
  ];

  return (
    <div className={styles.textbox}>
      <h5>{t('CMRMetadata.References.title')}</h5>
      {referenceNames.map((referenceName) => {
        return (
          <Row key={referenceName}>
            <Col>
              <span>{`${referenceName}: `}</span>
              <span>{references[referenceName]}</span>
            </Col>
          </Row>
        );
      })}
      <h5>{t('CMRMetadata.References.common')}</h5>
      {references.common.map((common: any) => {
        return (
          <Row key={common.key}>
            <Col>
              <span>{`${common.key}: `}</span>
              <span>{common.value}</span>
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default References;
