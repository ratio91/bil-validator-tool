import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../index.module.scss';
import { VehicleDto } from '../../../dto/vehicle.dto';

type CarrierProps = {
  carrierInstructions: string;
  carrierAddress: string;
  carrierCountryDetails: string;
  carrierCompany: string;
  carrierVehicles: VehicleDto[];
};

const mapVehicleTypeToVehicleName = (type: string): string => {
  type = type.toUpperCase();
  if (type === 'TRACTOR_UNIT') return 'Tractor';
  if (type === 'TRAILER' || type === 'TRAILER_UNIT') return 'Trailer';
  return type;
};

const Carrier: FunctionComponent<CarrierProps> = ({
  carrierInstructions,
  carrierAddress,
  carrierCompany,
  carrierCountryDetails,
  carrierVehicles,
}: CarrierProps) => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.textbox}>
      <div>
        <h5>{t('CMRDisplay.Carrier.title')}</h5>
        <div>
          {carrierCompany}
          <br />
          {carrierAddress}
          <br />
          {carrierCountryDetails}
        </div>
        <br />
      </div>
      <div>
        <h5>{t('CMRDisplay.CarrierInstructions.title')}</h5>
        <div>{carrierInstructions}</div>
      </div>
      <div>
        <span className={styles.bold}>{`${t('CMRDisplay.CarrierVehicles.title')}`}</span>
        {carrierVehicles.map((carrierVehicle) => {
          const { registration, type, ilu, capacity } = carrierVehicle;

          return (
            <div className={styles.textbox} key={registration}>
              <span className={styles.bold}>{`${t('CMRDisplay.CarrierVehicles.vehicleTypeLabel')}: `}</span>
              {`${mapVehicleTypeToVehicleName(type)}`}
              <br />
              <span className={styles.bold}>{`${t('CMRDisplay.CarrierVehicles.officialRegistrationLabel')}: `}</span>
              {`${registration}`}
              <br />
              <span className={styles.bold}>{`${t('CMRDisplay.CarrierVehicles.iluCodeLabel')}: `}</span>
              {`${ilu}`}
              <br />
              <span className={styles.bold}>{`${t('CMRDisplay.CarrierVehicles.weightCapacityLabel')}: `}</span>
              {`${capacity}`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carrier;
