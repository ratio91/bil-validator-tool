import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../index.module.scss';

type CMRStatusProps = {
  id: string;
};

const CMRField: FunctionComponent<CMRStatusProps> = ({ id }: CMRStatusProps) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.textbox}>
      <h5>{`${t('CMRDisplay.CMR.title')} ${id}`}</h5>
    </div>
  );
};

export default CMRField;
