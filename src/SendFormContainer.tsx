import React from 'react';
import { Transaction } from '@elrondnetwork/erdjs/out';
import { Formik } from 'formik';
import {
  AccountContextPropsType,
  AppInfoContextProvider,
  FormContextBasePropsType,
  TokensContextInitializationPropsType
} from 'contexts';
import { generateTransaction } from 'operations';
import { ExtendedValuesType, ValuesType } from 'types';
import { FormNetworkConfigType } from 'types/network';
import { getInitialErrors } from 'validation';
import validationSchema from 'validationSchema';

export interface SendFormContainerPropsType {
  initialValues: ExtendedValuesType;
  enableReinitialize?: boolean;
  initGasLimitError: string | null;
  onFormSubmit: (values: ValuesType, transaction: Transaction) => void;
  accountInfo: AccountContextPropsType;
  formInfo: Omit<FormContextBasePropsType, 'txType' | 'setTxType'>;
  tokensInfo: TokensContextInitializationPropsType;
  networkConfig: FormNetworkConfigType;
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
    networkConfig
  } = props;
  const { address, balance } = accountInfo;
  const { chainId } = networkConfig;

  //this is updated from within the main context with updated values

  const initialErrors = getInitialErrors({
    initialValues,
    prefilledForm: formInfo.prefilledForm
  });

  async function handleOnSubmit(values: ExtendedValuesType) {
    const transaction = await generateTransaction({
      address,
      balance,
      chainId,
      values
    });
    return onFormSubmit(values, transaction);
  }

  return (
    <Formik
      initialValues={initialValues}
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
      >
        {children}
      </AppInfoContextProvider>
    </Formik>
  );
}
