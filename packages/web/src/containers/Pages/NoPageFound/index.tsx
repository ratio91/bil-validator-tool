import React from 'react';
import { withRouter } from 'react-router';

import NoPageFound from '../../../components/NoPageFound';

/**
 * This component renders the page that is shown when there is no page according to the current
 * route. It shows a button that leads to the NewValidation page upon click.
 */
const NoPageFoundPage = () => (
  <div>
    <NoPageFound />
  </div>
);

export default withRouter(NoPageFoundPage);
