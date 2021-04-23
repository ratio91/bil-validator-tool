import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';

type BreadcrumbsProps = {
  activePage: string;
  pushAction: (location: string) => void;
};

/**
 * Tripartite breadcrumbs (navigation element) that offers navigation between "home page" for
 * new validation, first CMR page and second CMR page. Disappears when view gets too narrow
 * (mobile devices).
 *
 * @param breadcrumbProps Contains current page und push action for navigation.
 */
const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = (breadcrumbProps) => {
  const { t } = useTranslation('common');

  let cmrClass;

  if (breadcrumbProps.activePage === 'page1') {
    cmrClass = [styles.activeCrumb, styles.step].join(' ');
  }

  return (
    <div className={styles.stepper}>
      <div
        className={styles.step}
        role="presentation"
        onClick={() => {
          breadcrumbProps.pushAction('/');
        }}
      >
        <div className={styles.stepCircle}>
          <span>&rsaquo;</span>
        </div>
        <div>{t('Breadcrumbs.homeLabel')}</div>
      </div>
      <div className={styles.stepLine} />
      <div
        className={cmrClass}
        role="presentation"
        onClick={() => {
          breadcrumbProps.pushAction('/cmr');
        }}
      >
        <div className={styles.stepCircle}>
          <span>&rsaquo;</span>
        </div>
        <div>{t('Breadcrumbs.page1Label')}</div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
