import React, { useContext } from 'react';
import { mergeWith } from 'lodash';
import { initialUICustomization, mergeCustomizer } from 'helpers';
import { ValuesEnum } from 'types';

interface FormDataFieldType {
  classes: {
    container: string;
    label: string;
    textarea: string;
    invalidTextarea: string;
    errorMsg: string;
  };
  label: string | null;
  ignoreDefaultClasses: boolean;
}

interface FormToFieldType {
  classes: {
    container: string;
    label: string;
    inputContainer: string;
    inputContainerError: string;
    invalidReceiverErrorMsg: string;
    scamErrorMsg: string;
    scamErrorIcon: string;
  };
  label: string | null;
  ignoreDefaultClasses: boolean;
}

interface FormAmountFieldType {
  classes: {
    container: string;
    invalidInput: string;
    inputContainer: string;
    input: string;
    maxBtnContainer: string;
    maxBtn: string;
    errorMsg: string;
  };
  label: string | null;
  components: {
    tokenSelector: React.ElementType | null;
  };
  ignoreDefaultClasses: boolean;
}

interface CustomFields {
  [ValuesEnum.data]: FormDataFieldType;
  [ValuesEnum.receiver]: FormToFieldType;
  [ValuesEnum.amount]: FormAmountFieldType;
}

export interface UICustomizationContextPropsType {
  fields: CustomFields;
}

interface UICustomizationContextProviderPropsType {
  children: React.ReactNode;
  value?: Partial<UICustomizationContextPropsType>;
}

export const UICustomizationContext = React.createContext(
  {} as UICustomizationContextPropsType
);

export function UICustomizationContextProvider({
  children,
  value
}: UICustomizationContextProviderPropsType) {
  const customUI = !value
    ? initialUICustomization
    : mergeWith(initialUICustomization, value, mergeCustomizer);
  return (
    <UICustomizationContext.Provider value={customUI}>
      {children}
    </UICustomizationContext.Provider>
  );
}

export function useUICustomizationContext() {
  return useContext(UICustomizationContext);
}
