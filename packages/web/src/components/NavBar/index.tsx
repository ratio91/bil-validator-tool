import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { faCog, faHome, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootReducerState } from '../../reducers';
import LanguagePicker from '../LanguageSelector/LanguagePicker';
import { isElectronApp } from '../../utils/executionContextUtils';
import { resetErrorMessage as resetErrorMessageAction } from '../../actions';

import style from './index.module.scss';

interface DispatchProps {
  resetErrorMessage: () => void;
}

interface RouterProps {
  pushAction: (location: string) => void;
}

interface NavBarProps extends DispatchProps, RouterProps {}

const mapDispatchToProps = {
  resetErrorMessage: resetErrorMessageAction,
};

/**
 * This component implements the gray top bar with home link, link to help page and either
 * language picker or settings link, depending on whether this app is run with as web version or
 * Electron app, respectively.
 *
 * @param navBarProps Contains push action for navigation.
 */
const NavBar: FunctionComponent<NavBarProps> = ({ resetErrorMessage, pushAction }: NavBarProps) => {
  const { t } = useTranslation('common');

  let settingsNav;

  if (isElectronApp) {
    settingsNav = (
      <Nav>
        <Nav.Link
          onClick={() => {
            resetErrorMessage();
            pushAction('/settings');
          }}
        >
          <span className={style.settingsLabel}>{t('Navbar.settingsLabel')}</span>
          <span className={style.settingsIcon}>
            <FontAwesomeIcon icon={faCog} />
          </span>
        </Nav.Link>
      </Nav>
    );
  } else {
    settingsNav = <LanguagePicker showLabels={false} />;
  }

  return (
    <Navbar className={style.navBar} bg="dark">
      <Navbar.Brand
        style={{ cursor: 'pointer' }}
        className={style.brandNav}
        onClick={() => {
          pushAction('/');
        }}
      >
        <FontAwesomeIcon icon={faHome} />
        <span className={style.brandLabel}>{t('Navbar.toolLabel')}</span>
      </Navbar.Brand>
      <Nav className={style.manualNav}>
        <Nav.Link
          onClick={() => {
            pushAction('/help');
          }}
        >
          <span className={style.manualLabel}>{t('Navbar.howDoesItWorkLabel')}</span>
          <span className={style.manualIcon}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </span>
        </Nav.Link>
      </Nav>
      {settingsNav}
    </Navbar>
  );
};

export default connect<any, DispatchProps, RouterProps, RootReducerState>(null, mapDispatchToProps)(NavBar);
