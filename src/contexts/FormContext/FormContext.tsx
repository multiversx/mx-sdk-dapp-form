import React, {
  useCallback,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  MouseEvent
} from 'react';
import { Transaction } from '@multiversx/sdk-core/out';
import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import { useFormikContext } from 'formik';
import {
  ExtendedValuesType,
  PartialNftType,
  TransactionTypeEnum,
  ValuesEnum
} from 'types';
import { verifyInvalid } from 'validation';

export interface FormContextBasePropsType {
  hasGuardianScreen: boolean;
  hiddenFields?: ExtendedValuesType['hiddenFields'];
  isBurn?: boolean;
  isFormSubmitted: boolean;
  onCloseForm: () => void;
  prefilledForm: boolean;
  readonly?: ExtendedValuesType['readonly'];
  setGuardedTransaction: (transaction: Transaction) => void;
  setHasGuardianScreen: Dispatch<SetStateAction<boolean>>;
  setIsFormSubmitted: Dispatch<SetStateAction<boolean>>;
  skipToConfirm?: boolean;
  uiOptions?: ExtendedValuesType['uiOptions'];
}

export interface FormContextPropsType extends FormContextBasePropsType {
  isEgldTransaction: boolean;
  isEsdtTransaction: boolean;
  isNftTransaction: boolean;
  areValidatedValuesReady: boolean;
  shouldValidateForm: boolean;
  isFormValid: boolean;
  renderKey: number;
  txType: TransactionTypeEnum;
  checkInvalid: (value: keyof ExtendedValuesType) => boolean;
  onValidateForm: () => void;
  onInvalidateForm: () => void;
  onPreviewClick?: (event: MouseEvent, data: PartialNftType) => void;
  onSubmitForm: () => void;
  isGuardianScreenVisible: boolean;
  setIsGuardianScreenVisible: Dispatch<SetStateAction<boolean>>;
}

interface FormContextProviderPropsType {
  children: any;
  value: FormContextBasePropsType;
}

export const FormContext = createContext({} as FormContextPropsType);

export function FormContextProvider({
  children,
  value
}: FormContextProviderPropsType) {
  const { skipToConfirm } = value;
  const [shouldValidateForm, setShouldValidateForm] = useState(
    Boolean(skipToConfirm)
  );
  const [isGuardianScreenVisible, setIsGuardianScreenVisible] = useState(false);

  const [renderKey, setRenderKey] = useState(Date.now());
  const {
    values,
    errors,
    touched,
    validateForm,
    setFieldTouched,
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

    Object.values(ValuesEnum).forEach((value) => {
      setFieldTouched(value, true);
    });

    const newErrors = await validateForm();

    if (Object.keys(newErrors).length === 0) {
      value.setIsFormSubmitted(true);
      return;
    }

    const gasLimitError = errors.gasLimit;

    if (gasLimitError || newErrors.gasPrice) {
      setErrors(newErrors);
      // open FeeAccordion
      setRenderKey(Date.now());
    }
  }, [errors, validateForm]);

  /**
   * Invalidate form based on the current step. The "value.setIsFormSubmitted" will toggle between fields and summary.
   */

  const handleInvalidateForm = useCallback(() => {
    if (!isGuardianScreenVisible) {
      value.setIsFormSubmitted(false);
    } else {
      setIsGuardianScreenVisible(false);
    }
  }, [isGuardianScreenVisible]);

  const contextValue: FormContextPropsType = {
    ...value,
    checkInvalid,
    isEgldTransaction: isEgld,
    isEsdtTransaction: isEsdt,
    isNftTransaction: isNft,
    shouldValidateForm,
    areValidatedValuesReady:
      Boolean(value.isFormSubmitted || skipToConfirm) && isFormValid,
    isGuardianScreenVisible,
    setIsGuardianScreenVisible,
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
