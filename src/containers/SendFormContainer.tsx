import React, { JSXElementConstructor, useState } from 'react';
import {
  Transaction,
  TransactionOptions,
  TransactionVersion
} from '@multiversx/sdk-core';
import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/constants/index';
import { GuardianProvider } from '@multiversx/sdk-dapp/services/transactions/GuardianProvider';
import { Formik, FormikHelpers } from 'formik';

import { ZERO } from 'constants/index';
import {
  AccountContextPropsType,
  AppInfoContextProvider,
  FormContextBasePropsType,
  TokensContextInitializationPropsType
} from 'contexts';

import { UICustomizationContextPropsType } from 'contexts/UICustomization';
import {
  generateTransaction,
  getTxType,
  formattedConfigGasPrice,
  getGasLimit
} from 'operations';
import { ExtendedValuesType, TransactionTypeEnum, ValuesType } from 'types';
import { FormNetworkConfigType } from 'types/network';
import { getInitialErrors } from 'validation';
import validationSchema from 'validationSchema';

export interface SendFormContainerPropsType {
  initialValues?: ExtendedValuesType;
  enableReinitialize?: boolean;
  initGasLimitError?: string;
  onFormSubmit: (
    values: ValuesType,
    transaction: Transaction | null,
    /**
     * control isFormSubmitted from outside
     */
    setIsFormSubmitted?: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
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
    enableReinitialize = true,
    Loader,
    UICustomization,
    shouldGenerateTransactionOnSubmit = true
  } = props;

  const { address, balance } = accountInfo;
  const { chainId } = networkConfig;
  const [isFormSubmitted, setIsFormSubmitted] = useState(
    Boolean(props.formInfo.skipToConfirm)
  );

  //this is updated from within the main context with updated values

  const initialErrors = getInitialErrors({
    initialValues,
    prefilledForm: formInfo.prefilledForm
  });

  async function handleOnSubmit(
    values: ExtendedValuesType,
    { setFieldValue }: FormikHelpers<ExtendedValuesType>
  ) {
    const actualTransactionAmount =
      values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;
    const parsedValues = { ...values, amount: actualTransactionAmount };

    let transaction = shouldGenerateTransactionOnSubmit
      ? await generateTransaction({
          address,
          balance,
          chainId,
          nonce: accountInfo.nonce,
          values: parsedValues
        })
      : null;

    try {
      if (accountInfo.isGuarded && values.code && transaction) {
        const provider = GuardianProvider.getInstance();
        await provider.init(
          accountInfo.address,
          String(networkConfig.apiAddress)
        );

        // TODO: to be removed when included in provider
        transaction.version = TransactionVersion.withTxOptions();
        transaction.options = TransactionOptions.withTxGuardedOptions();
        const [guardedTransaction] = await provider.applyGuardianSignature(
          [transaction],
          values.code
        );
        transaction = guardedTransaction;
      }
    } catch {
      return setFieldValue('codeError', 'Invalid code');
    }

    return onFormSubmit(parsedValues, transaction, setIsFormSubmitted);
  }

  const tokenId =
    initialValues?.tokenId ||
    networkConfig?.egldLabel ||
    fallbackNetworkConfigurations.mainnet.egldLabel;

  const data = initialValues?.data ?? '';

  const txType =
    initialValues?.txType ??
    getTxType({ nft: tokensInfo?.initialNft, tokenId });

  const gasLimit =
    initialValues?.gasLimit ??
    getGasLimit({ txType, data, isGuarded: accountInfo.isGuarded });

  const formikInitialValues = {
    tokenId,
    receiver: initialValues?.receiver ?? '',
    gasPrice: initialValues?.gasPrice ?? formattedConfigGasPrice,
    data,
    amount: initialValues?.amount ?? ZERO,
    gasLimit,
    txType,
    address: initialValues?.address ?? address,
    nft: tokensInfo?.initialNft,
    balance: initialValues?.balance || balance,
    isGuarded: initialValues?.isGuarded ?? accountInfo.isGuarded,
    chainId: initialValues?.chainId || networkConfig.chainId,
    tokens: tokensInfo?.initialTokens,
    ledger: initialValues?.ledger,
    code: ''
  };

  return (
    <Formik
      initialValues={formikInitialValues}
      enableReinitialize={enableReinitialize}
      onSubmit={handleOnSubmit}
      initialErrors={initialErrors}
      validationSchema={validationSchema}
    >
      <AppInfoContextProvider
        initGasLimitError={initGasLimitError}
        accountInfo={accountInfo}
        formInfo={{
          ...formInfo,
          isFormSubmitted,
          setIsFormSubmitted
        }}
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
