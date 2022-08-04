import React from 'react';
import { fallbackNetworkConfigurations } from '@elrondnetwork/dapp-core/constants/network';

import {
  EnvironmentsEnum,
  LoginMethodsEnum
} from '@elrondnetwork/dapp-core/types/enums';
import { render } from '@testing-library/react';
import { SendFormContainer, SendFormContainerPropsType } from 'containers';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import useGetInitialValues, {
  GetInitialValuesReturnType
} from 'hooks/useGetInitialValues';
// import useGetInitialValues, {
//   GetInitialValuesReturnType
// } from 'hooks/useGetInitialValues';
import getTxType from 'operations/getTxType';
import { ExtendedValuesType } from 'types/form';
import { ConfirmScreen } from 'UI/ConfirmScreen';
import { Form } from 'UI/Form';

const activeNetwork = fallbackNetworkConfigurations[EnvironmentsEnum.devnet];

const TestWrapper = () => {
  const configValues = {
    receiver: '',
    amount: '0',
    tokenId: '',
    gasLimit: '0',
    gasPrice: '0',
    data: ''
  };
  const initValues = useGetInitialValues({
    configValues,
    egldLabel: 'EGLD',
    address: '',
    chainId: '1',
    balance: '0',
    nonce: 0,
    networkConfig: activeNetwork
  });

  if (!initValues) {
    return <span data-testid='span'>11</span>;
  }

  const initialValues = configValues;
  const {
    nft: initialNft,
    gasLimitCostError
    // computedTokens,
    // tokenFound,
    // computedTokenId
  } = initValues as GetInitialValuesReturnType;

  const validationValues: ExtendedValuesType = {
    ...initialValues,
    txType: getTxType({ nft: initialNft, tokenId: initialValues.tokenId }),
    address: '',
    chainId: '1',
    balance: '0'
    // ...(isLedger ? ledgerProps : {})
  };

  const containerProps: Omit<SendFormContainerPropsType, 'children'> = {
    networkConfig: {
      ...activeNetwork,
      skipFetchFromServer: true
    },
    initGasLimitError: gasLimitCostError,
    initialValues: validationValues,
    onFormSubmit: () => 'log submit',
    accountInfo: {
      address: '',
      nonce: 0,
      balance: '',
      providerType: LoginMethodsEnum.extra
    },
    formInfo: {
      prefilledForm: Boolean(false),
      skipToConfirm: false,
      readonly: false,
      onCloseForm: () => 'this is close form'
    },
    tokensInfo: {
      initialNft,
      initialTokens: []
    }
  };
  return (
    <SendFormContainer {...containerProps}>
      <span data-testid='span'>12</span>
      <FormContent />
    </SendFormContainer>
  );
};

export const beforeAll = () => {
  return render(<TestWrapper />);
};

function FormContent() {
  const {
    formInfo: { areValidatedValuesReady }
  } = useSendFormContext();

  return areValidatedValuesReady ? (
    <ConfirmScreen providerType={LoginMethodsEnum.extra} />
  ) : (
    <Form />
  );
}
