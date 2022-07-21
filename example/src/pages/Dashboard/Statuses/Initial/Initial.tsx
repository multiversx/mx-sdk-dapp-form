import React from 'react';

import {
  SendFormContainer,
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

const Initial = () => {
  const formProps = useFormProps();

  return (
    <SendFormContainer {...formProps}>
      <FormContent />
    </SendFormContainer>
  );
};

export { Initial };
