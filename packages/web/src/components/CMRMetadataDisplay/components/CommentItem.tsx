import React, { FunctionComponent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { AgentsDto } from '../../../dto/agents.dto';
import { AttachmentDto } from '../../../dto/attachment.dto';
import { getAgentRoleTranslationKey } from '../../../utils/metadataUtils';
import { formatDateLong } from '../../../utils/timeUtils';

import styles from '../index.module.scss';

type CommentItemProps = {
  timestamp: string;
  text: string;
  attachments: AttachmentDto[];
  responsible: string;
  agents: AgentsDto;
};

const CommentItem: FunctionComponent<CommentItemProps> = ({
  text,
  attachments,
  timestamp,
  responsible,
  agents,
}: CommentItemProps) => {
  const { t } = useTranslation('common');

  let changeLogElement = null;

  if (!_.isEmpty(attachments)) {
    const attachmentsString = attachments
      .map((attachment) => ` ${attachment.fileDescription} (${attachment.fileName})`)
      .join(',');

    changeLogElement = <span className={styles.smaller}>{`${t('CMRMetadata.attachment')} ${attachmentsString}`}</span>;
  }

  return (
    <div className={styles.textbox}>
      <Container fluid>
        <Row>
          <Col>
            <span className={styles.light}>{formatDateLong(timestamp)}</span>
          </Col>
        </Row>
        <Row>
          <Col>{text}</Col>
        </Row>
        <Row>
          <Col>
            <span className={styles.smaller}>
              {`${t('CMRMetadata.roleLabel')}: ${t(getAgentRoleTranslationKey(agents, responsible))}`}
            </span>
          </Col>
        </Row>
        <Row>
          <Col>{changeLogElement}</Col>
        </Row>
      </Container>
    </div>
  );
};

export default CommentItem;
