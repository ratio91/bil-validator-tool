import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import IdPinFormComponent from '../../../../components/IdPinForm';
import { RootReducerState } from '../../../../reducers';

import styles from './index.module.scss';

type ValidatePrintedProps = {
  pushAction: (location: string) => void;
};

/**
 * This component implements the view fragment for validation of a printed CMR. Consists of
 * title and input form with submit button.
 *
 * @param pushAction Push action used for navigation between pages.
 */
const ValidatePrintedPage: FunctionComponent<ValidatePrintedProps> = ({ pushAction }: ValidatePrintedProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <h2>{t('NewValidation.ValidatePrinted.title')}</h2>

      <div className={styles.box}>
        <p>
          {t('NewValidation.ValidatePrinted.infobox')}
          <span className={styles.pointer} role="presentation" onClick={() => pushAction('/help')}>
            <b>{` ${t('NewValidation.ValidatePrinted.infoboxDetailedExplanation')}`}</b>
          </span>
        </p>
      </div>

      <IdPinFormComponent />
    </>
  );
};

export default connect<null, null, any, RootReducerState>(null, null)(ValidatePrintedPage);
