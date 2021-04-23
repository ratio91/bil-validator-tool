import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import AttachmentItem from './AttachmentItem';

import styles from '../index.module.scss';
import { AttachmentDto } from '../../../dto/attachment.dto';

type AttachmentProps = {
  attachments: AttachmentDto[];
};

const Attachments: FunctionComponent<AttachmentProps> = ({ attachments }: AttachmentProps) => {
  const { t } = useTranslation('common');

  let attachmentsElement = <div>{t('CMRDisplay.Attachments.noGiven')}</div>;

  if (!_.isEmpty(attachments)) {
    attachmentsElement = (
      <>
        {attachments.map((attachment: AttachmentDto) => (
          <AttachmentItem
            key={attachment.file_name}
            fileName={attachment.file_name}
            fileDescription={attachment.file_description}
          />
        ))}
      </>
    );
  }

  return (
    <div className={styles.textbox}>
      <h5>{t('CMRDisplay.Attachments.attachmentLabel')}</h5>
      {attachmentsElement}
    </div>
  );
};

export default Attachments;
