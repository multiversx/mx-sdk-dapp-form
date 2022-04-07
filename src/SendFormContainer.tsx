import React, { JSXElementConstructor } from 'react';
import { fallbackNetworkConfigurations } from '@elrondnetwork/dapp-core';
import { Transaction } from '@elrondnetwork/erdjs/out';
import { Formik } from 'formik';
import {
  AccountContextPropsType,
  AppInfoContextProvider,
  FormContextBasePropsType,
  TokensContextInitializationPropsType
} from 'contexts';

import { generateTransaction } from 'operations';
import { ExtendedValuesType, TxTypeEnum, ValuesType } from 'types';
import { FormNetworkConfigType } from 'types/network';
import { SendLoader } from 'UI';
import { getInitialErrors } from 'validation';
import validationSchema from 'validationSchema';
import { defaultGasLimit, defaultGasPrice } from './constants';

export interface SendFormContainerPropsType {
  initialValues?: ExtendedValuesType;
  enableReinitialize?: boolean;
  initGasLimitError?: string | null;
  onFormSubmit: (values: ValuesType, transaction: Transaction | null) => void;
  accountInfo: AccountContextPropsType;
  formInfo: Omit<FormContextBasePropsType, 'txType' | 'setTxType'>;
  tokensInfo?: TokensContextInitializationPropsType;
  networkConfig: FormNetworkConfigType;
  Loader?: JSXElementConstructor<any> | null;
  shouldGenerateTransactionOnSubmit?: boolean;
  children: React.ReactNode;
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
    Loader = SendLoader,
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
    const transaction = shouldGenerateTransactionOnSubmit
      ? await generateTransaction({
          address,
          balance,
          chainId,
          nonce: accountInfo.nonce,
          values
        })
      : null;
    return onFormSubmit(values, transaction);
  }

  const formikInitialValues = {
    receiver: initialValues?.receiver || '',
    gasPrice: initialValues?.gasPrice || defaultGasPrice,
    data: initialValues?.data || '',
    tokenId:
      initialValues?.tokenId ||
      networkConfig?.egldLabel ||
      fallbackNetworkConfigurations.mainnet.egldLabel,
    amount: initialValues?.amount || '0',
    gasLimit: initialValues?.gasLimit || String(defaultGasLimit),
    txType: initialValues?.txType || TxTypeEnum.EGLD,
    address: initialValues?.address || address,
    balance: initialValues?.balance || balance,
    chainId: initialValues?.chainId || networkConfig.chainId
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
      >
        {children}
      </AppInfoContextProvider>
    </Formik>
  );
}
