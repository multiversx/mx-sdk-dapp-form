import React from 'react';

import {
  SendFormContainer,
  denominatedConfigGasPrice,
  SendFormContainerPropsType,
  useSendFormContext
} from '@elrondnetwork/dapp-core-form';
import { Form, ConfirmScreen } from '@elrondnetwork/dapp-core-form/UI';
import { useGetAccountProvider } from '@elrondnetwork/dapp-core/hooks';

import { useFormProps } from 'pages/Dashboard/context';

const FormContent = () => {
  const {
    formInfo: { areValidatedValuesReady }
  } = useSendFormContext();
  const { providerType } = useGetAccountProvider();

  return areValidatedValuesReady ? (
    <ConfirmScreen providerType={providerType} />
  ) : (
    <Form />
  );
};

const FilledDisabled = () => {
  const formProps = useFormProps();
  const props: SendFormContainerPropsType = {
    ...formProps,
    initialValues: {
      receiver:
        'erd13rrn3fwjds8r5260n6q3pd2qa6wqkudrhczh26d957c0edyzermshds0k8',
      data: 'I am sending you over 2 EGLD!',
      amount: '2',
      gasLimit: (75_000_000).toString(),
      gasPrice: denominatedConfigGasPrice
    },
    formInfo: {
      ...formProps.formInfo,
      prefilledForm: true,
      readonly: true
    }
  };

  return (
    <SendFormContainer {...props}>
      <FormContent />
    </SendFormContainer>
  );
};

export { FilledDisabled };
