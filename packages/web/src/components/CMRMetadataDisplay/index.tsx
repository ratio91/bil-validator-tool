import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import References from './components/References';
import SuccessiveCarrier from './components/SuccessiveCarrier';
import ChangeLog from './components/ChangeLog';
import { EcmrDto } from '../../dto/ecmr.dto';
import DamageList from './components/DamageList';

interface CMRDisplayProps {
  cmrData: EcmrDto;
}

/**
 * This component renders the fields on the second page of a CMR document.
 *
 * @param cmrData eCMR data to display.
 */
const Index: FunctionComponent<CMRDisplayProps> = ({ cmrData }: CMRDisplayProps) => {
  const { t } = useTranslation('common');

  const { references, events, damages, successives } = cmrData;

  return (
    <>
      <SuccessiveCarrier successiveCarriers={successives} />
      <References references={references} />
      <ChangeLog events={events} />
      <DamageList
        title={t('CMRMetadata.DamageReport.title')}
        damages={damages}
        noGiven={t('CMRMetadata.DamageReport.noGiven')}
      />
    </>
  );
};

export default Index;
