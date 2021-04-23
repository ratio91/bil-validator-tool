import React, { FunctionComponent } from 'react';

import { Col, Row } from 'react-bootstrap';
import _ from 'lodash';
import styles from '../index.module.scss';
import { formatDateShort } from '../../../utils/timeUtils';
import { DamageDto } from '../../../dto/damage.dto';

type DamageListProps = {
  title: string;
  damages: DamageDto[];
  noGiven: string;
};

const DamageList: FunctionComponent<DamageListProps> = ({ damages, noGiven, title }: DamageListProps) => {
  let damageListElement = <div>{noGiven}</div>;

  if (!_.isEmpty(damages)) {
    damageListElement = (
      <>
        {damages.map((damage) => {
          return (
            <Row key={damage.created_at}>
              <Col>
                <span>{`${formatDateShort(damage.created_at)}: `}</span>
                <span>{damage.text}</span>
                <span>
                  {damage.responsible_roles.map((role) => {
                    return <span key={role}>{role} ,</span>;
                  })}
                </span>
                <span>
                  {damage.files.map((file) => {
                    return <span key={file.file_name}>{file.file_name} ,</span>;
                  })}
                </span>
              </Col>
            </Row>
          );
        })}
      </>
    );
  }

  return (
    <div className={[styles.textbox, styles.extraTopMargin].join(' ')}>
      <h5>{title}</h5>
      {damageListElement}
    </div>
  );
};

export default DamageList;
