import React, { FunctionComponent } from 'react';
import styles from '../index.module.scss';

type CompanyDetailsProps = {
  companyName: string;
  address: string;
  countryDetails: string;
  title: string;
};

const CompanyDetails: FunctionComponent<CompanyDetailsProps> = ({
  companyName,
  address,
  countryDetails,
  title,
}: CompanyDetailsProps) => (
  <div className={styles.textbox}>
    <h5>{title}</h5>
    <div>
      {companyName}
      <br />
      {address}
      <br />
      {countryDetails}
    </div>
  </div>
);

export default CompanyDetails;
