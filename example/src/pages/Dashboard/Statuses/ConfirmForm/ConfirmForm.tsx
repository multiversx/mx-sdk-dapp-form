import React from 'react';

import {
  SendFormContainer,
  denominatedConfigGasPrice,
  SendFormContainerPropsType
} from '@elrondnetwork/dapp-core-form';
import { ConfirmScreen } from '@elrondnetwork/dapp-core-form/UI';

import { useFormProps } from 'pages/Dashboard/context';
import styles from './styles.module.scss';

export const ConfirmForm = () => {
  const formProps = useFormProps();
  const props: SendFormContainerPropsType = {
    ...formProps,
    initialValues: {
      receiver:
        'erd13rrn3fwjds8r5260n6q3pd2qa6wqkudrhczh26d957c0edyzermshds0k8',
      data: 'I am sending you over 100 EGLD!',
      amount: '100',
      gasLimit: (75_000_000).toString(),
      gasPrice: denominatedConfigGasPrice
    },
    formInfo: {
      ...formProps.formInfo,
      prefilledForm: true
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <SendFormContainer {...props}>
          <ConfirmScreen providerType={formProps.formInfo.providerType} />
        </SendFormContainer>
      </div>
    </div>
  );
};
