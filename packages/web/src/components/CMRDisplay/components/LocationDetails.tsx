import React, { FunctionComponent } from 'react';
import _ from 'lodash';
import { formatDateShort } from '../../../utils/timeUtils';

import styles from '../index.module.scss';

type LocationDetailsProps = {
  address: string;
  companyName?: string;
  countryDetails: string;
  date?: string;
  geoCoordinates: string;
  headline: string;
};

const LocationDetails: FunctionComponent<LocationDetailsProps> = ({
  address,
  companyName,
  countryDetails,
  date,
  geoCoordinates,
  headline,
}: LocationDetailsProps) => {
  const additionalMetaData = [];

  if (!_.isEmpty(date)) {
    additionalMetaData.push(formatDateShort(date));
    additionalMetaData.push(<br key="br_1" />);
  }

  if (!_.isEmpty(companyName)) {
    additionalMetaData.push(companyName);
    additionalMetaData.push(<br key="br_2" />);
  }

  return (
    <div className={styles.textbox}>
      <h5>{headline}</h5>
      <div>
        {additionalMetaData}
        {address}
        <br key="br_3" />
        {countryDetails}
        <br key="br_4" />
        {geoCoordinates}
      </div>
    </div>
  );
};

export default LocationDetails;
