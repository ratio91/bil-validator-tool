import React, { FunctionComponent } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import { useTranslation } from 'react-i18next';

import {
  getCurrentLanguage,
  getFlags,
  getISOCodeFromCountryFlag,
  getLabels,
  setLanguage,
} from '../../utils/languageUtils';
import style from './index.module.scss';

interface LanguagePickerProps {
  showLabels: boolean;
}

/**
 * Language picker meant to be used in the navigation bar (web app) or settings page (electron app).
 *
 * @param showLabels Whether to show language labels in dropdown menu or when selected.
 */
const LanguagePicker: FunctionComponent<LanguagePickerProps> = ({ showLabels }: LanguagePickerProps) => {
  const currentLanguageEntry = getCurrentLanguage();
  const { i18n } = useTranslation('common');

  const onLanguageChanged = (countryCode: string) => {
    const isoCode: string = getISOCodeFromCountryFlag(countryCode);
    i18n.changeLanguage(isoCode);
    setLanguage(isoCode);
  };

  return (
    <ReactFlagsSelect
      className={style.flagImages}
      countries={getFlags()}
      customLabels={getLabels()}
      defaultCountry={currentLanguageEntry.countryFlag}
      placeholder="Select Language"
      onSelect={onLanguageChanged}
      optionsSize={20}
      selected="EN"
      selectedSize={20}
      showOptionLabel={showLabels}
      showSelectedLabel={showLabels}
    />
  );
};

export default LanguagePicker;
