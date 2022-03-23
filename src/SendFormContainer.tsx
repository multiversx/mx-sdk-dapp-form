import React, { useState } from 'react';
import { Transaction } from '@elrondnetwork/erdjs';
import { Formik } from 'formik';
import {
  AccountContextPropsType,
  AppInfoContextProvider,
  FormContextBasePropsType,
  TokensContextInitializationPropsType
} from 'contexts';
import { generateTransaction } from 'operations';
import { TxTypeEnum, ValidationSchemaType, ValuesType } from 'types';
import getInitialErrors from 'validation/getInitialErrors';
import validationSchema from 'validationSchema';

export interface SendFormContainerPropsType {
  initialValues: ValuesType;
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
  const { readonly } = formInfo;

  //this is updated from within the main context with updated values
  const [validationSchemaProps, setValidationSchemaProps] =
    useState<ValidationSchemaType>({
      address,
      balance,
      chainId,
      readonly,
      txType: TxTypeEnum.EGLD,
      egldLabel: 'EGLD',
      tokenId: '',
      tokens: []
    });
  const initialErrors = getInitialErrors({
    validationSchemaProps,
    initialValues,
    prefilledForm: formInfo.prefilledForm
  });

  async function handleOnSubmit(values: ValuesType) {
    const transaction = await generateTransaction({
      address,
      balance,
      chainId,
      //TODO fix this when submit process is decided
      txType: validationSchemaProps.txType,
      nft: validationSchemaProps?.nft,
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
      validationSchema={validationSchema(validationSchemaProps)}
    >
      <AppInfoContextProvider
        initGasLimitError={props.initGasLimitError}
        account={props.account}
        formInfo={props.formInfo}
        tokensInfo={props.tokensInfo}
        updateValidationSchemaProps={setValidationSchemaProps}
      >
        {children}
      </AppInfoContextProvider>
    </Formik>
  );
}
