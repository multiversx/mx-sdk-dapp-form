import React from 'react';

import { SendFormContainer } from '@elrondnetwork/dapp-core-form';
import { Form } from '@elrondnetwork/dapp-core-form/UI';

import { useFormProps } from 'pages/Dashboard/context';

export const Initial = () => {
  const formProps = useFormProps();

  return (
    <SendFormContainer {...formProps}>
      <Form />
    </SendFormContainer>
  );
};
