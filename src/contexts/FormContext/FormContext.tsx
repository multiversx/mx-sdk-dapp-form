import React, { useCallback, useContext, useState } from 'react';
import { getIdentifierType } from '@elrondnetwork/dapp-core';
import { useFormikContext } from 'formik';
import { ExtendedValuesType, TxTypeEnum } from 'types';
import { verifyInvalid } from 'validation';

export interface FormContextBasePropsType {
  prefilledForm: boolean;
  skipToConfirm?: boolean;
  readonly?: boolean;
  onCloseForm: () => void;
}

export interface FormContextPropsType extends FormContextBasePropsType {
  isEgldTransaction: boolean;
  isEsdtTransaction: boolean;
  isNftTransaction: boolean;
  areValidatedValuesReady: boolean;
  shouldValidateForm: boolean;
  isFormValid: boolean;
  renderKey: number;
  txType: TxTypeEnum;
  checkInvalid: (value: keyof ExtendedValuesType) => boolean;
  onValidateForm: () => void;
  onInvalidateForm: () => void;
  onSubmitForm: () => void;
}

interface FormContextProviderPropsType {
  children: any;
  value: FormContextBasePropsType;
}

export const FormContext = React.createContext({} as FormContextPropsType);

export function FormContextProvider({
  children,
  value
}: FormContextProviderPropsType) {
  const { skipToConfirm } = value;
  const [shouldValidateForm, setShouldValidateForm] = useState(
    Boolean(skipToConfirm)
  );
  const [isFormSubmitted, setIsFormSubmitted] = useState(
    Boolean(skipToConfirm)
  );

  const [renderKey, setRenderKey] = useState(Date.now());
  const {
    values,
    errors,
    touched,
    validateForm,
    setErrors,
    isValid: isFormValid,
    handleSubmit
  } = useFormikContext<ExtendedValuesType>();
  const memoizedClose = useCallback(value.onCloseForm, []);
  const { isEsdt, isNft, isEgld } = getIdentifierType(values.tokenId);

  const checkInvalid = useCallback(
    verifyInvalid({
      shouldValidateForm, // TODO: check
      errors,
      touched
    }),
    [shouldValidateForm, errors, touched]
  );

  const handleCheckForm = useCallback(async () => {
    setShouldValidateForm(true);

    const newErrors = await validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsFormSubmitted(true);
      return;
    }

    const gasLimitError = errors.gasLimit;
    if (gasLimitError || newErrors.gasPrice) {
      setErrors(newErrors);
      // open FeeAccordion
      setRenderKey(Date.now());
    }
  }, [errors, validateForm]);

  const handleInvalidateForm = useCallback(() => {
    setIsFormSubmitted(false);
  }, []);

  const contextValue: FormContextPropsType = {
    ...value,
    checkInvalid,
    isEgldTransaction: isEgld,
    isEsdtTransaction: isEsdt,
    isNftTransaction: isNft,
    shouldValidateForm,
    areValidatedValuesReady:
      Boolean(isFormSubmitted || skipToConfirm) && isFormValid,
    isFormValid,
    renderKey,
    txType: values.txType,
    onValidateForm: handleCheckForm,
    onInvalidateForm: handleInvalidateForm,
    onCloseForm: memoizedClose,
    onSubmitForm: handleSubmit
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}

export function useFormContext() {
  return useContext(FormContext);
}
