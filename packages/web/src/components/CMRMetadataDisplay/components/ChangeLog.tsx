import React, { FunctionComponent } from 'react';

import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from '../index.module.scss';
import { EventDto } from '../../../dto/event.dto';
import { formatDateShort } from '../../../utils/timeUtils';

type ChangeLogProps = {
  events: EventDto[];
};

const ChangeLog: FunctionComponent<ChangeLogProps> = ({ events }: ChangeLogProps) => {
  const { t } = useTranslation('common');

  return (
    <div className={[styles.textbox, styles.extraTopMargin].join(' ')}>
      <h5>{t('CMRMetadata.ChangeLog.title')}</h5>
      <br />
      {events.map((event) => {
        return (
          <Row key={event.created_at}>
            <Col>
              <span>{`${formatDateShort(event.created_at)}: `}</span>
              <span>{event.reference_field}</span>
              <span>
                {event.responsible_roles.map((role) => {
                  return <span key={role}>{role} ,</span>;
                })}
              </span>
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default ChangeLog;
