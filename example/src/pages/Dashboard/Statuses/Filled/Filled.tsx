import React from 'react';

import {
  SendFormContainer,
  formattedConfigGasPrice,
  SendFormContainerPropsType
} from '@multiversx/sdk-dapp-form';
import { Form } from '@multiversx/sdk-dapp-form/UI';

import { useFormProps } from 'pages/Dashboard/context';

export const Filled = () => {
  const formProps = useFormProps();
  const props: SendFormContainerPropsType = {
    ...formProps,
    initialValues: {
      receiver:
        'erd13rrn3fwjds8r5260n6q3pd2qa6wqkudrhczh26d957c0edyzermshds0k8',
      data: 'I am sending you over 580 EGLD!',
      amount: '580',
      gasLimit: (75_000_000).toString(),
      gasPrice: formattedConfigGasPrice
    },
    formInfo: {
      ...formProps.formInfo,
      prefilledForm: true
    }
  };

  return (
    <SendFormContainer {...props}>
      <Form />
    </SendFormContainer>
  );
};
