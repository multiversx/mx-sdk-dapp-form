import React, { useContext } from 'react';
import { merge } from 'lodash';

interface FormDataFieldType {
  container?: string;
  label?: string;
  textarea?: string;
  invalidTextarea?: string;
  errorMsg?: string;
}

interface FormToFieldType {
  container?: string;
  label?: string;
  inputContainer?: string;
  inputContainerError?: string;
  invalidReceiverErrorMsg?: string;
  scamErrorMsg?: string;
  scamErrorIcon?: string;
}

interface FormAmountFieldType {
  container?: string;
  invalidInput?: string;
  inputContainer?: string;
  input?: string;
  maxBtnContainer?: string;
  maxBtn?: string;
  errorMsg?: string;
}

export interface UICustomizationContextPropsType {
  formDataField: FormDataFieldType;
  formToField: FormToFieldType;
  formAmountField: FormAmountFieldType;
}

export const initialUICustomization = {
  formDataField: {
    container: 'form-group mb-0',
    label: 'pb-1',
    textarea: 'form-control',
    invalidTextarea: 'is-invalid',
    errorMsg: 'invalid-feedback'
  },
  formToField: {
    container: 'form-group',
    label: 'mb-2',
    inputContainer: 'notranslate typeahead',
    inputContainerError: 'is-invalid',
    invalidReceiverErrorMsg: 'invalid-feedback',
    scamErrorMsg: 'text-warning',
    scamErrorIcon: 'text-warning mr-1'
  },
  formAmountField: {
    container: 'form-group amount',
    invalidInput: 'is-invalid',
    inputContainer: 'amount-holder',
    input: 'form-control amount-input',
    maxBtnContainer: 'd-flex align-content-center justify-content-end',
    maxBtn: 'btn btn-link',
    errorMsg: 'invalid-feedback'
  }
};

interface UICustomizationContextProviderPropsType {
  children: React.ReactNode;
  value?: UICustomizationContextPropsType;
}

export const UICustomizationContext = React.createContext(
  {} as UICustomizationContextPropsType
);

export function UICustomizationContextProvider({
  children,
  value
}: UICustomizationContextProviderPropsType) {
  const customClasses = value
    ? merge(initialUICustomization, value)
    : initialUICustomization;
  return (
    <UICustomizationContext.Provider value={customClasses}>
      {children}
    </UICustomizationContext.Provider>
  );
}

export function useUICustomizationContext() {
  return useContext(UICustomizationContext);
}
