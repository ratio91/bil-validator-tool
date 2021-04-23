import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

import { isElectronApp } from '../../../utils/executionContextUtils';
import NavBar from '../../../components/NavBar';

import styles from './index.module.scss';

import LogoArrow from './images/newvalidation_arrow_on_logo_cropped_de.png';
import UploadArrow from './images/newvalidation_arrow_on_upload_cropped_de.png';
import FormArrow from './images/newvalidation_idpin_arrows_cropped_de.png';
import Cmr from './images/cmr_blured_arrows_cropped.png';
import NotFound from './images/not_found_cropped_de.png';
import Valid from './images/pdf_valid_cropped_de.png';
import Invalid from './images/invalid_file_cropped_de.png';
import FirstPageByIdPin from './images/page1_yellow_cropped_de.png';
import Flag from './images/newvalidation_arrow_on_flag_de.png';
import Settings from './images/newvalidation_electron_arrow_cropped_de.png';
import ElectronFlag from './images/settings_arrow_on_flag_cropped_de.png';
import NodeButton from './images/settings_arrow_on_node_cropped_de.png';
import NodeField from './images/settings_node_arrow_on_address_field_cropped_de.png';

interface RouterProps {
  title: string;
}

interface ManualProps extends RouteComponentProps<RouterProps>, DispatchProps {}

interface DispatchProps {
  pushAction: (location: string) => void;
}

const mapDispatchToProps = {
  pushAction: push,
};

/**
 * This component implements the help page (manual).
 *
 * @param pushAction Push action used for navigation between pages.
 */
const Manual: FunctionComponent<ManualProps> = ({ pushAction }: ManualProps) => {
  const { t } = useTranslation('common');

  let settingsFragment;

  if (isElectronApp) {
    settingsFragment = (
      <>
        <h2>{t('Help.Electron.Language.title')}</h2>
        <ol className={styles.list}>
          <li>
            {t('Help.Electron.Language.list.1')}
            <img className={styles.screenshot} src={Settings} alt="flag" />
          </li>
          <li>
            {t('Help.Electron.Language.list.2')}
            <img className={styles.screenshot} src={ElectronFlag} alt="flag" />
          </li>
        </ol>
        <h2>{t('Help.Electron.CustomNode.title')}</h2>
        <ol className={styles.list}>
          <li>{t('Help.Electron.CustomNode.list.1')}</li>
          <li>
            {t('Help.Electron.CustomNode.list.2')}
            <div className={styles.note}>{t('Help.Electron.CustomNode.note')}</div>
            <img className={styles.screenshot} src={NodeButton} alt="button to declare custom node" />
          </li>
          <li>
            {t('Help.Electron.CustomNode.list.3')}
            <img className={styles.screenshot} src={NodeField} alt="field to insert custom node address" />
          </li>
        </ol>
      </>
    );
  } else {
    settingsFragment = (
      <>
        <h2>{t('Help.Web.SetLanguage.title')}</h2>
        {t('Help.Web.SetLanguage.text')}
        <img className={styles.screenshot} src={Flag} alt="flag" />
      </>
    );
  }

  return (
    <>
      <NavBar pushAction={pushAction} />
      <div className={styles.contentWrapper}>
        <h2>{t('Help.Introduction.title')}</h2>
        {t('Help.Introduction.text')}
        {isElectronApp && <div className={styles.note}>{t('Help.Electron.note')}</div>}
        <h2>{t('Help.ValidatePdf.title')}</h2>
        {t('Help.ValidatePdf.text')}
        <ol className={styles.list}>
          <li>
            {t('Help.ValidatePdf.list.1')}
            <img className={styles.screenshot} src={LogoArrow} alt="ValidatorTool link" />
          </li>
          <li>
            {t('Help.ValidatePdf.list.2')}
            <img className={styles.screenshot} src={UploadArrow} alt="upload button" />
          </li>
          <li>{t('Help.ValidatePdf.list.3')}</li>
          <li>
            {t('Help.ValidatePdf.list.4')}
            <img className={styles.screenshot} src={Valid} alt="valid cmr pdf" />
          </li>
          <li>
            {t('Help.ValidatePdf.list.5')}
            <img className={styles.screenshot} src={Invalid} alt="invalid file" />
          </li>
        </ol>
        <h2>{t('Help.ValidatePrinted.title')}</h2>
        {t('Help.ValidatePrinted.text')}
        <ol className={styles.list}>
          <li>{t('Help.ValidatePrinted.list.1')}</li>
          <li>
            {t('Help.ValidatePrinted.list.2')}
            <img className={styles.screenshot} src={Cmr} alt="cmr document" />
          </li>
          <li>
            {t('Help.ValidatePrinted.list.3')}
            <img className={styles.screenshot} src={FormArrow} alt="form" />
          </li>
          <li>
            {t('Help.ValidatePrinted.list.4')}
            <img className={styles.screenshot} src={FirstPageByIdPin} alt="yellow alert" />
          </li>
          <li>
            {t('Help.ValidatePrinted.list.5')}
            <img className={styles.screenshot} src={NotFound} alt="not found" />
          </li>
        </ol>
        {settingsFragment}
        <Button className={styles.backButton} variant="secondary" onClick={() => pushAction('/new-validation')}>
          {t('Help.backButtonLabel')}
        </Button>
      </div>
    </>
  );
};

export default connect<any, DispatchProps, ManualProps, any>(null, mapDispatchToProps)(withRouter(Manual));
