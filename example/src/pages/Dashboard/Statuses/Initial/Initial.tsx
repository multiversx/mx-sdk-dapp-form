import React from 'react';

import { SendFormContainer } from '@multiversx/sdk-dapp-form';
import { Form } from '@multiversx/sdk-dapp-form/UI';

import { useFormProps } from 'pages/Dashboard/context';

export const Initial = () => {
  const formProps = useFormProps();

  return (
    <SendFormContainer {...formProps}>
      <Form />
    </SendFormContainer>
  );
};
