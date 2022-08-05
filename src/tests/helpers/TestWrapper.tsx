import React from 'react';
import { fallbackNetworkConfigurations } from '@elrondnetwork/dapp-core/constants/network';

import {
  EnvironmentsEnum,
  LoginMethodsEnum
} from '@elrondnetwork/dapp-core/types/enums';
import { Loader } from '@elrondnetwork/dapp-core/UI/Loader';
import { SendFormContainer, SendFormContainerPropsType } from 'containers';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import useGetInitialValues, {
  GetInitialValuesReturnType
} from 'hooks/useGetInitialValues';
import getTxType from 'operations/getTxType';
import { ExtendedValuesType, FormConfigType } from 'types/form';
import { ConfirmScreen } from 'UI/ConfirmScreen';
import { Form } from 'UI/Form';
import { accountConfiguration } from './accountConfiguration';
import { formConfiguration } from './formConfiguraiton';

const activeNetwork = fallbackNetworkConfigurations[EnvironmentsEnum.testnet];

export interface TestWrapperType {
  formConfigValues?: FormConfigType;
  balance?: string;
  address?: string;
  chainId?: string;
  ledger?: ExtendedValuesType['ledger'];
}

export const TestWrapper = ({
  formConfigValues = formConfiguration,
  balance = accountConfiguration.balance,
  address = accountConfiguration.address,
  chainId = accountConfiguration.chainId,
  ledger
}: TestWrapperType) => {
  const initValues = useGetInitialValues({
    configValues: formConfigValues,
    ...accountConfiguration,
    balance,
    address
  });

  if (!initValues) {
    return <Loader dataTestId='loader' />;
  }

  const initialValues = formConfigValues;
  const {
    nft: initialNft,
    gasLimitCostError
    // computedTokens,
    // tokenFound,
    // computedTokenId
  } = initValues as GetInitialValuesReturnType;

  const validationValues: ExtendedValuesType = {
    ...initialValues,
    tokenId: String(initialValues.tokenId),
    txType: getTxType({
      nft: initialNft,
      tokenId: String(initialValues.tokenId)
    }),
    address,
    chainId,
    balance,
    ...(ledger ? ledger : {})
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
      address,
      nonce: accountConfiguration.nonce,
      balance,
      providerType: LoginMethodsEnum.extra
    },
    formInfo: {
      prefilledForm: false,
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
      <FormContent />
    </SendFormContainer>
  );
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
