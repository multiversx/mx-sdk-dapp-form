import React, { useState } from 'react';
import { Loader } from '@multiversx/sdk-dapp-form/UI/Loader';
import classNames from 'classnames';

import { DashboardContextProvider, useFormProps } from './context';
import { Initial, Filled, FilledDisabled, ConfirmForm } from './Statuses';

import styles from './styles.module.scss';

const Dashboard = () => {
  const [current, setCurrent] = useState(0);
  const tabs = [
    { label: 'Initial View', component: Initial },
    { label: 'Prefilled View', component: Filled },
    { label: 'Prefilled Disabled View', component: FilledDisabled },
    { label: 'Confirmation Screen View', component: ConfirmForm }
  ];

  const tab = tabs[current];
  const formProps = useFormProps();

  return (
    <div className={styles.wrapper}>
      <div className={styles.triggers}>
        {tabs.map((item, index) => (
          <div
            key={`tab-${item.label}-trigger`}
            onClick={() => setCurrent(index)}
            className={classNames(styles.trigger, {
              [styles.active]: index === current
            })}
          >
            Form - {item.label}
          </div>
        ))}
      </div>

      <div
        className={classNames(styles.content, {
          [styles.borderless]: current === tabs.length - 1
        })}
      >
        {formProps.networkConfig ? (
          <div className={styles.tab}>
            <tab.component />
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default DashboardContextProvider(Dashboard);
