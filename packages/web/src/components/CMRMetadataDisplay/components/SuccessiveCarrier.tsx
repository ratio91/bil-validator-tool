import React, { FunctionComponent } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styles from '../../CMRDisplay/index.module.scss';
import { SuccessiveDto } from '../../../dto/successive.dto';

type SuccessiveCarrierProps = {
  successiveCarriers: SuccessiveDto[];
};

const SuccessiveCarrier: FunctionComponent<SuccessiveCarrierProps> = ({
  successiveCarriers,
}: SuccessiveCarrierProps) => {
  const { t } = useTranslation('common');

  let successiveCarrierElement = <div>{t('CMRDisplay.SuccessiveCarrier.noGiven')}</div>;

  if (!_.isEmpty(successiveCarriers)) {
    successiveCarrierElement = (
      <>
        {successiveCarriers.map((successiveCarrier) => {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { entity } = successiveCarrier;
          const { company_name, address, postal, city, country } = entity;

          return (
            <div key={company_name}>
              {company_name}
              <br />
              {address}
              <br />
              {`${postal} ${city}, ${country}`}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <div className={styles.textbox}>
      <div>
        <h5>{t('CMRDisplay.SuccessiveCarrier.title')}</h5>
        {successiveCarrierElement}
        <br />
      </div>
    </div>
  );
};

export default SuccessiveCarrier;
