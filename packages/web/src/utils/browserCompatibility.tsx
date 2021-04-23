import { BotInfo, BrowserInfo, NodeInfo, ReactNativeInfo, SearchBotDeviceInfo } from 'detect-browser';

const MIN_SUPPORTED_CHROME = 71;
const MIN_SUPPORTED_FIREFOX = 68;
const MIN_SUPPORTED_EDGE = 17;
const MIN_SUPPORTED_SAFARI = 9;
const MIN_SUPPORTED_IE = 11;

export enum BrowserCompatibilityError {
  UNSUPPORTED_BROWSER = 1,
  UNABLE_TO_DETECT_BROWSER,
  UNABLE_TO_DETECT_BROWSER_VERSION,
}

export interface BrowserCompatibilityResult {
  compatible: boolean;
  errorMessage?: BrowserCompatibilityError;
  browserName?: string;
}

/**
 * @return Returns BrowserCompatibilityResult where compatible field shows if the browser is supported.
 * If the Browser cant be detected an additional error message is returned.
 */
export const isBrowserSupported = (
  browserData: BrowserInfo | SearchBotDeviceInfo | BotInfo | NodeInfo | ReactNativeInfo | null,
): BrowserCompatibilityResult => {
  const result: BrowserCompatibilityResult = { compatible: false, browserName: '' };
  if (browserData === null) {
    result.errorMessage = BrowserCompatibilityError.UNABLE_TO_DETECT_BROWSER;
    return result;
  }
  if (!browserData.version || browserData.version === '') {
    result.errorMessage = BrowserCompatibilityError.UNABLE_TO_DETECT_BROWSER_VERSION;
    return result;
  }

  const browserVersion = parseInt(browserData.version.split('.')[0], 10);
  let minVersion = 0;

  switch (browserData.name) {
    case 'chrome':
      result.browserName = 'Chrome';
      minVersion = MIN_SUPPORTED_CHROME;
      break;
    case 'firefox':
      result.browserName = 'Firefox';
      minVersion = MIN_SUPPORTED_FIREFOX;
      break;
    case 'ie':
      result.browserName = 'Internet Explorer';
      minVersion = MIN_SUPPORTED_IE;
      break;
    case 'safari':
    case 'ios':
      result.browserName = 'Safari';
      minVersion = MIN_SUPPORTED_SAFARI;
      break;
    case 'edge-chromium':
    case 'edge':
      result.browserName = 'Edge';
      minVersion = MIN_SUPPORTED_EDGE;
      break;
    default:
      result.errorMessage = BrowserCompatibilityError.UNSUPPORTED_BROWSER;
      break;
  }

  if (!result.errorMessage && browserVersion >= minVersion) {
    result.compatible = true;
  }
  return result;
};
