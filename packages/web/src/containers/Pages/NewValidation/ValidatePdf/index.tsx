import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootReducerState } from '../../../../reducers';
import { fetchCMRByPdf as fetchCMRByPdfAction } from '../../../../actions';

import styles from './index.module.scss';

interface DispatchProps {
  fetchCMRByPdf: (file: File) => void;
}

const mapDispatchToProps = {
  fetchCMRByPdf: fetchCMRByPdfAction,
};

/**
 * This component implements the view fragment for validation of a CMR-PDF. Consists of title and
 * upload button.
 *
 * @param fetchCMRByPdf Action that triggers the fetching of the CMR by PDF.
 */
const ValidatePdfPage: FunctionComponent<DispatchProps> = ({ fetchCMRByPdf }: DispatchProps) => {
  const { t } = useTranslation('common');

  // Resets values for selected files such that same file can be uploaded twice in a row in
  // Chrome(ium).
  const handleClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const { currentTarget } = event;
    currentTarget.value = '';
  };

  return (
    <>
      <h2>{t('NewValidation.ValidatePdf.title')}</h2>
      <label htmlFor="file-upload" className="btn btn-primary btn-sm">
        <span>{t('NewValidation.ValidatePdf.uploadButtonLabel')}</span>
      </label>
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        className={styles.uploadButton}
        onChange={(event) => (event.target.files != null ? fetchCMRByPdf(event.target.files[0]) : {})}
        onClick={handleClick}
      />
    </>
  );
};

export default connect<any, DispatchProps, any, RootReducerState>(null, mapDispatchToProps)(ValidatePdfPage);
