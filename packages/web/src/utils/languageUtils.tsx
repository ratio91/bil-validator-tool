import _ from 'lodash';

interface LanguageEntry {
  ISOCode: string;
  countryFlag: string;
  label: string;
}

export const supportedLanguagesMap: { [country: string]: LanguageEntry } = {
  german: {
    ISOCode: 'de',
    countryFlag: 'DE',
    label: 'Deutsch',
  },
  english: {
    ISOCode: 'en',
    countryFlag: 'US',
    label: 'English',
  },
};

export const getFlags = () => {
  const languageKeys = Object.keys(supportedLanguagesMap);
  return languageKeys.map((key) => {
    return supportedLanguagesMap[key].countryFlag;
  });
};

export const getFlagByISOCode = (isoCode: string): LanguageEntry => {
  const languageKeys = Object.keys(supportedLanguagesMap);
  const langKey = languageKeys.filter((key) => supportedLanguagesMap[key].ISOCode === isoCode);
  if (langKey.length === 1) {
    return supportedLanguagesMap[langKey[0]];
  }
  return supportedLanguagesMap.english;
};

export const getLabels = () => {
  const labels: { [propName: string]: string } = {};
  const languageKeys = Object.keys(supportedLanguagesMap);
  languageKeys.forEach((key) => {
    const flag = supportedLanguagesMap[key].countryFlag;
    labels[flag] = supportedLanguagesMap[key].label;
  });
  return labels;
};

export const setLanguage = (isoCode: string) => {
  localStorage.setItem('lang', isoCode);
};

export const getLanguageLabelByISOCode = (isoCode: string): string => {
  const languageKeys = Object.keys(supportedLanguagesMap);
  const langKey = languageKeys.filter(
    (key) => supportedLanguagesMap[key].ISOCode === isoCode.toLocaleLowerCase().slice(0, 2),
  );
  if (langKey.length === 1) {
    return supportedLanguagesMap[langKey[0]].label;
  }
  return supportedLanguagesMap.english.label;
};

export const getLanguageEntryByISOCode = (isoCode: string): LanguageEntry => {
  const languageKeys = Object.keys(supportedLanguagesMap);
  const langKey = languageKeys.filter(
    (key) => supportedLanguagesMap[key].ISOCode === isoCode.toLocaleLowerCase().slice(0, 2),
  );
  if (langKey.length === 1) {
    return supportedLanguagesMap[langKey[0]];
  }
  return supportedLanguagesMap.english;
};

const defaultISOCode = localStorage.getItem('lang') || navigator.language;
const defaultLanguage = getLanguageLabelByISOCode(defaultISOCode);

export const getISOCodeFromCountryFlag = (country: string) => {
  const languageEntryIndex: string =
    Object.keys(supportedLanguagesMap).find((key) => supportedLanguagesMap[key].countryFlag === country) ||
    defaultLanguage;
  const languageEntry: LanguageEntry = supportedLanguagesMap[languageEntryIndex];
  return languageEntry.ISOCode;
};

export const getCurrentLanguage = (): LanguageEntry => {
  const currentLanguage = localStorage.getItem('lang');
  if (_.isNull(currentLanguage)) {
    return getLanguageEntryByISOCode(defaultISOCode);
  }
  return getFlagByISOCode(currentLanguage);
};
