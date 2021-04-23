import React, { FunctionComponent } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import LanguageComponent from './components/LanguageComponent';
import CustomEthereumNodeComponent from './components/CustomEtherNodeComponent';

/**
 * This component implements the view fragment in the settings page with the title, the language
 * picker and the interface for setting the custom Ethereum node.
 */
const Index: FunctionComponent = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <h2>{t('Settings.title')}</h2>
      <Container fluid>
        <LanguageComponent />
        <CustomEthereumNodeComponent />
      </Container>
    </>
  );
};

export default Index;
