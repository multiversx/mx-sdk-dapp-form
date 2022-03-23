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
  children: React.ReactNode;
}

export function SendFormContainer(props: SendFormContainerPropsType) {
  const { initialValues, onFormSubmit, formInfo, children, account } = props;
  const { address, balance, chainId } = account;

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
      //TODO fix this when submit process is decided
      txType: values.txType,
      nft: values.nft,
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
        tokensInfo={props.tokensInfo}
      >
        {children}
      </AppInfoContextProvider>
    </Formik>
  );
}
