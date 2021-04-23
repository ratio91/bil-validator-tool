import React from 'react';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import { useTranslation } from 'react-i18next';

/**
 * This component renders the page that is shown when there is no page according to the current
 * route. It shows a button that leads to the NewValidation page upon click.
 *
 * @param history History object for navigation back to home page.
 */
const NoPageFound = ({ history }: { history: History }) => {
  const { t } = useTranslation('common');

  return (
    <div>
      <p>{t('NoPageError.infoText')}</p>
      <button
        type="button"
        onClick={() => {
          history.push('/');
        }}
      >
        {t('NoPageError.homeLabel')}
      </button>
    </div>
  );
};

export default withRouter(NoPageFound);
