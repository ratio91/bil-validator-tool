import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadDto } from '../../../dto/load.dto';

import styles from '../index.module.scss';

type LoadProps = {
  load: LoadDto[];
};

const Load: FunctionComponent<LoadProps> = ({ load }: LoadProps) => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.textbox}>
      <h5>{`${t('CMRDisplay.Load.loadLabel')}`}</h5>
      {load.map((loadElement: LoadDto, index: number) => {
        const key = `load${index}`;
        const { marks, number, packing, nature, statistical_nr, gross_weight, volume } = loadElement;

        return (
          <div className={[styles.textbox, styles.smallBox].join(' ')} key={key}>
            <span className={styles.bold}>{`${t('CMRDisplay.Load.marksLabel')}: `}</span>
            <span>{marks}</span>
            <br />
            <span className={styles.bold}>{`${t('CMRDisplay.Load.numPackagesLabel')}: `}</span>
            <span>{number}</span>
            <br />
            <span className={styles.bold}>{`${t('CMRDisplay.Load.packingMethodLabel')}: `}</span>
            <span>{packing}</span>
            <br />
            <span className={styles.bold}>{`${t('CMRDisplay.Load.goodsDescriptionLabel')}: `}</span>
            <span>{nature}</span>
            <br />
            <span className={styles.bold}>{`${t('CMRDisplay.Load.grossWeightLabel')}: `}</span>
            <span>{statistical_nr}</span>
            <br />
            <span className={styles.bold}>{`${t('CMRDisplay.Load.statNumberLabel')}: `}</span>
            <span>{gross_weight}</span>
            <br />
            <span className={styles.bold}>{`${t('CMRDisplay.Load.volumeLabel')}: `}</span>
            <span>{volume}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Load;
