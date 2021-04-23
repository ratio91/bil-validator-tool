import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { formatDateShort } from '../../../utils/timeUtils';

import styles from '../index.module.scss';

type EstablishedProps = {
  establishedIn: string;
  establishedAt: string;
};

const Established: FunctionComponent<EstablishedProps> = ({ establishedIn, establishedAt }: EstablishedProps) => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.textbox}>
      <h5>{`${t('CMRDisplay.Established.title')}`}</h5>
      <div>{`${establishedIn}, ${formatDateShort(establishedAt)}`}</div>
    </div>
  );
};

export default Established;
