import React, {
  Dispatch,
  JSXElementConstructor,
  ReactNode,
  SetStateAction,
  useState
} from 'react';
import { Transaction } from '@multiversx/sdk-core';
import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/constants/index';
import { Formik } from 'formik';

import { ZERO } from 'constants/index';
import {
  AccountContextPropsType,
  AppInfoContextProvider,
  FormContextBasePropsType,
  TokensContextInitializationPropsType
} from 'contexts';

import { getTransactionFields } from 'helpers';
import {
  formattedConfigGasPrice,
  generateTransaction,
  getGasLimit,
  getTxType
} from 'operations';
import { ExtendedValuesType, ValuesType } from 'types';
import { FormNetworkConfigType } from 'types/network';
import { ValidationErrorMessagesType } from 'types/validation';
import { getInitialErrors } from 'validation';
import { getValidationSchema } from 'validationSchema';
import { defaultErrorMessages } from '../validation/defaultErrorMessages';

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
    setIsFormSubmitted?: Dispatch<SetStateAction<boolean>>
  ) => void;
  accountInfo: AccountContextPropsType;
  formInfo: Omit<FormContextBasePropsType, 'txType' | 'setTxType'>;
  tokensInfo?: TokensContextInitializationPropsType;
  networkConfig: FormNetworkConfigType;
  Loader?: JSXElementConstructor<any> | null;
  shouldGenerateTransactionOnSubmit?: boolean;
  children: ReactNode | JSX.Element;
  errorMessageTranslations?: Partial<ValidationErrorMessagesType>;
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
    errorMessageTranslations = defaultErrorMessages,
    shouldGenerateTransactionOnSubmit = true
  } = props;

  const { address, balance, username } = accountInfo;
  const { chainId, apiAddress } = networkConfig;
  const [isFormSubmitted, setIsFormSubmitted] = useState(
    Boolean(props.formInfo.skipToConfirm)
  );
  const [guardedTransaction, setGuardedTransaction] = useState<Transaction>();
  const [hasGuardianScreen, setHasGuardianScreen] = useState(false);

  //this is updated from within the main context with updated values

  const initialErrors = getInitialErrors({
    initialValues,
    prefilledForm: formInfo.prefilledForm,
    errorMessages: defaultErrorMessages
  });

  async function handleOnSubmit(values: ExtendedValuesType) {
    const parsedValues = await getTransactionFields(values, {
      apiAddress
    });

    const transaction = shouldGenerateTransactionOnSubmit
      ? guardedTransaction ??
        (await generateTransaction({
          address,
          balance,
          chainId,
          nonce: accountInfo.nonce,
          values: parsedValues
        }))
      : null;

    return onFormSubmit(parsedValues, transaction, setIsFormSubmitted);
  }

  const tokenId =
    initialValues?.tokenId ||
    networkConfig?.egldLabel ||
    fallbackNetworkConfigurations.mainnet.egldLabel;

  const validationSchema = getValidationSchema({
    ...errorMessageTranslations,
    //this will make sure that if we add a key in the future, it will not be breaking for current usages
    //and will allow users to pass their own translations in pieces, not the whole object
    ...defaultErrorMessages
  });

  const data = initialValues?.data ?? '';

  const txType =
    initialValues?.txType ??
    getTxType({ nft: tokensInfo?.initialNft, tokenId });

  const gasLimit =
    initialValues?.gasLimit ??
    getGasLimit({
      txType,
      data,
      isGuarded: accountInfo.isGuarded,
      isDeposit: formInfo.isDeposit
    });

  const formikInitialValues = {
    address: initialValues?.address ?? address,
    amount: initialValues?.amount ?? ZERO,
    balance: initialValues?.balance || balance,
    chainId: initialValues?.chainId || networkConfig.chainId,
    code: '',
    data,
    gasLimit,
    gasPrice: initialValues?.gasPrice ?? formattedConfigGasPrice,
    isBurn: formInfo.isBurn,
    isGuarded: initialValues?.isGuarded ?? accountInfo.isGuarded,
    ledger: initialValues?.ledger,
    nft: tokensInfo?.initialNft,
    receiver: initialValues?.receiver ?? '',
    receiverUsername: initialValues?.receiverUsername,
    senderUsername: username,
    tokenId,
    tokens: tokensInfo?.initialTokens,
    txType
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
          setIsFormSubmitted,
          setGuardedTransaction,
          hasGuardianScreen,
          setHasGuardianScreen
        }}
        networkConfig={networkConfig}
        tokensInfo={tokensInfo}
        Loader={Loader}
      >
        {children}
      </AppInfoContextProvider>
    </Formik>
  );
}
