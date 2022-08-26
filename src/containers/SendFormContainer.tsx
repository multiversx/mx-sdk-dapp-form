import React, { JSXElementConstructor } from 'react';
import {
  fallbackNetworkConfigurations,
  GAS_LIMIT
} from '@elrondnetwork/dapp-core/constants/index';
import { Transaction } from '@elrondnetwork/erdjs';
import { Formik } from 'formik';

import { ZERO } from 'constants/index';
import {
  AccountContextPropsType,
  AppInfoContextProvider,
  FormContextBasePropsType,
  TokensContextInitializationPropsType
} from 'contexts';

import { UICustomizationContextPropsType } from 'contexts/UICustomization';
import { generateTransaction, getTxType } from 'operations';
import { formattedConfigGasPrice } from 'operations/formattedConfigGasPrice';
import { ExtendedValuesType, TransactionTypeEnum, ValuesType } from 'types';
import { FormNetworkConfigType } from 'types/network';
import { getInitialErrors } from 'validation';
import validationSchema from 'validationSchema';

export interface SendFormContainerPropsType {
  initialValues?: ExtendedValuesType;
  enableReinitialize?: boolean;
  initGasLimitError?: string;
  onFormSubmit: (values: ValuesType, transaction: Transaction | null) => void;
  accountInfo: AccountContextPropsType;
  formInfo: Omit<FormContextBasePropsType, 'txType' | 'setTxType'>;
  tokensInfo?: TokensContextInitializationPropsType;
  networkConfig: FormNetworkConfigType;
  Loader?: JSXElementConstructor<any> | null;
  shouldGenerateTransactionOnSubmit?: boolean;
  UICustomization?: UICustomizationContextPropsType;
  children: React.ReactNode | JSX.Element;
}

export function SendFormContainer(props: SendFormContainerPropsType) {
  const {
    initialValues,
    onFormSubmit,
    formInfo,
    children,
    accountInfo,
    tokensInfo,
    initGasLimitError,
    networkConfig,
    Loader,
    UICustomization,
    shouldGenerateTransactionOnSubmit = true
  } = props;

  const { address, balance } = accountInfo;
  const { chainId } = networkConfig;

  //this is updated from within the main context with updated values

  const initialErrors = getInitialErrors({
    initialValues,
    prefilledForm: formInfo.prefilledForm
  });

  async function handleOnSubmit(values: ExtendedValuesType) {
    const actualTransactionAmount =
      values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;
    const parsedValues = { ...values, amount: actualTransactionAmount };

    const transaction = shouldGenerateTransactionOnSubmit
      ? await generateTransaction({
          address,
          balance,
          chainId,
          nonce: accountInfo.nonce,
          values: parsedValues
        })
      : null;

    return onFormSubmit(parsedValues, transaction);
  }

  const tokenId =
    initialValues?.tokenId ||
    networkConfig?.egldLabel ||
    fallbackNetworkConfigurations.mainnet.egldLabel;

  const formikInitialValues = {
    tokenId,
    receiver: initialValues?.receiver ?? '',
    gasPrice: initialValues?.gasPrice ?? formattedConfigGasPrice,
    data: initialValues?.data ?? '',
    amount: initialValues?.amount ?? ZERO,
    gasLimit: initialValues?.gasLimit ?? String(GAS_LIMIT),
    txType:
      initialValues?.txType ??
      getTxType({ nft: tokensInfo?.initialNft, tokenId }),
    address: initialValues?.address ?? address,
    nft: tokensInfo?.initialNft,
    balance: initialValues?.balance || balance,
    chainId: initialValues?.chainId || networkConfig.chainId,
    tokens: tokensInfo?.initialTokens,
    ledger: initialValues?.ledger
  };

  return (
    <Formik
      initialValues={formikInitialValues}
      enableReinitialize
      onSubmit={handleOnSubmit}
      initialErrors={initialErrors}
      validationSchema={validationSchema}
    >
      <AppInfoContextProvider
        initGasLimitError={initGasLimitError}
        accountInfo={accountInfo}
        formInfo={formInfo}
        networkConfig={networkConfig}
        tokensInfo={tokensInfo}
        Loader={Loader}
        UICustomization={UICustomization}
      >
        {children}
      </AppInfoContextProvider>
    </Formik>
  );
}
