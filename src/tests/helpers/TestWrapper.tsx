import React, { useState } from 'react';
import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/out/constants';
import { ProviderTypeEnum } from '@multiversx/sdk-dapp/out/providers/types/providerFactory.types';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { SendFormContainer, SendFormContainerPropsType } from 'containers';
import {
  useGetInitialValues,
  GetInitialValuesReturnType
} from 'hooks/useGetInitialValues';
import getTxType from 'operations/getTxType';
import { GuardianScreenType } from 'types';
import { ExtendedValuesType, FormConfigType } from 'types/form';
import { Form } from 'UI/Form';
import { Loader } from 'UI/Loader';
import { accountConfiguration } from './accountConfiguration';
import { formConfiguration } from './formConfiguraiton';

const activeNetwork = fallbackNetworkConfigurations[EnvironmentsEnum.testnet];

export interface TestWrapperType {
  formConfigValues?: FormConfigType;
  balance?: string;
  address?: string;
  chainId?: string;
  GuardianScreen?: (props: GuardianScreenType) => JSX.Element;
  isGuarded?: boolean;
  ledger?: ExtendedValuesType['ledger'];
  isDeposit?: boolean;
}

export const TestWrapper = ({
  formConfigValues = formConfiguration,
  balance = accountConfiguration.balance,
  address = accountConfiguration.address,
  chainId = accountConfiguration.chainId,
  ledger,
  isGuarded,
  GuardianScreen,
  isDeposit
}: TestWrapperType) => {
  const initValues = useGetInitialValues({
    configValues: formConfigValues,
    ...accountConfiguration,
    balance,
    address
  });

  const [hasGuardianScreen, setHasGuardianScreen] = useState(
    Boolean(GuardianScreen)
  );

  const [isFormSubmitted, setIsFormSubmitted] = useState(
    Boolean(formConfigValues.skipToConfirm)
  );

  if (!initValues) {
    return <Loader data-testid={FormDataTestIdsEnum.loader} />;
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
      skipFetchFromServer: true,
      apiTimeout: Number(activeNetwork.apiTimeout)
    },
    initGasLimitError: gasLimitCostError,
    initialValues: validationValues,
    onFormSubmit: () => 'log submit',
    accountInfo: {
      address,
      isGuarded,
      shard: accountConfiguration.shard,
      nonce: accountConfiguration.nonce,
      balance,
      providerType: ProviderTypeEnum
    },
    formInfo: {
      prefilledForm: false,
      isDeposit,
      skipToConfirm: false,
      readonly: false,
      isFormSubmitted,
      setIsFormSubmitted,
      onCloseForm: () => '',
      setGuardedTransaction: (transaction) => {
        console.log(transaction);
      },
      setHasGuardianScreen,
      hasGuardianScreen
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
      <Form GuardianScreen={GuardianScreen} />
    </SendFormContainer>
  );
};
