import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import ROUTES from './routes';
import NewValidationPage from '../Pages/NewValidation';
import CMRPage from '../Pages/CMRPage';
import PDFPage from '../Pages/PDFPage';
import HelpPage from '../Pages/HelpPage';
import SettingsPage from '../Pages/SettingsPage';
import NoPageFoundPage from '../Pages/NoPageFound';
import { isElectronApp } from '../../utils/executionContextUtils';

/**
 * This component resides just below the root component and renders the page according to the
 * current path.
 */
const Router = () => {
  return (
    <Switch>
      <Route exact path="/index.html" render={() => <Redirect to="/" />} />
      <Route exact path="/" render={() => <Redirect to={ROUTES.NEW_VALIDATION} />} />
      <Route exact path={ROUTES.NEW_VALIDATION} component={NewValidationPage} />
      <Route exact path={ROUTES.CMR} component={CMRPage} />
      <Route exact path={ROUTES.PDF} component={PDFPage} />
      <Route exact path={ROUTES.HELP} component={HelpPage} />
      {isElectronApp && <Route exact path={ROUTES.SETTINGS} component={SettingsPage} />}
      <Route component={NoPageFoundPage} />
    </Switch>
  );
};

export default Router;
