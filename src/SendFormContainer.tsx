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
  account: AccountContextPropsType;
  formInfo: Omit<FormContextBasePropsType, 'txType' | 'setTxType'>;
  tokensInfo: TokensContextInitializationPropsType;
  formNetworkConfig: FormNetworkConfigType;
  children: React.ReactNode;
}

export function SendFormContainer(props: SendFormContainerPropsType) {
  const {
    initialValues,
    onFormSubmit,
    formInfo,
    children,
    account,
    formNetworkConfig
  } = props;
  const { address, balance } = account;
  const { chainId } = formNetworkConfig;

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
        initGasLimitError={props.initGasLimitError}
        account={props.account}
        formInfo={props.formInfo}
        formNetworkConfig={formNetworkConfig}
        tokensInfo={props.tokensInfo}
      >
        {children}
      </AppInfoContextProvider>
    </Formik>
  );
}
