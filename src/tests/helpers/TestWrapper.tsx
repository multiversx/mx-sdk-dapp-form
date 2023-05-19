import React, { useState } from 'react';
import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/constants/network';

import {
  EnvironmentsEnum,
  LoginMethodsEnum
} from '@multiversx/sdk-dapp/types/enums.types';
import { GuardianScreenType } from '@multiversx/sdk-dapp/types/transactions.types';
import { Loader } from '@multiversx/sdk-dapp/UI/Loader';
import { SendFormContainer, SendFormContainerPropsType } from 'containers';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import {
  useGetInitialValues,
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
  GuardianScreen?: (props: GuardianScreenType) => JSX.Element;
  ledger?: ExtendedValuesType['ledger'];
}

export const TestWrapper = ({
  formConfigValues = formConfiguration,
  balance = accountConfiguration.balance,
  address = accountConfiguration.address,
  chainId = accountConfiguration.chainId,
  ledger,
  GuardianScreen
}: TestWrapperType) => {
  const initValues = useGetInitialValues({
    configValues: formConfigValues,
    ...accountConfiguration,
    balance,
    address
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(
    Boolean(formConfigValues.skipToConfirm)
  );

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
    ...(ledger ? { ledger: { ...ledger } } : {})
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
      isGuarded: Boolean(GuardianScreen),
      nonce: accountConfiguration.nonce,
      balance,
      providerType: LoginMethodsEnum.extra
    },
    formInfo: {
      prefilledForm: false,
      skipToConfirm: false,
      readonly: false,
      isFormSubmitted,
      setIsFormSubmitted,
      onCloseForm: () => '',
      setGuardedTransaction: (transaction) => {
        console.log(transaction);
      },
      setHasGuardianScreen: () => {
        return false;
      },
      hasGuardianScreen: false
    },
    tokensInfo: {
      initialNft,
      initialTokens:
        initValues?.computedTokens.map((token) => ({
          ...token,
          ledgerSignature: (token as any).assets?.ledgerSignature || '',
          decimals: token.decimals
        })) ?? []
    }
  };
  return (
    <SendFormContainer {...containerProps}>
      <FormContent GuardianScreen={GuardianScreen} />
    </SendFormContainer>
  );
};

const FormContent = ({
  GuardianScreen
}: {
  GuardianScreen?: TestWrapperType['GuardianScreen'];
}) => {
  const {
    formInfo: { areValidatedValuesReady }
  } = useSendFormContext();

  return areValidatedValuesReady ? (
    <ConfirmScreen providerType={LoginMethodsEnum.extra} />
  ) : (
    <Form GuardianScreen={GuardianScreen} />
  );
};
