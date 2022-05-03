import React, { useContext } from 'react';
import { mergeWith } from 'lodash';

interface FormDataFieldType {
  classes: {
    container: string;
    label: string;
    textarea: string;
    invalidTextarea: string;
    errorMsg: string;
  };
  label: string;
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
  label: string;
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
  label: string;
  components: {
    tokenSelector: React.ElementType | null;
  };
  ignoreDefaultClasses: boolean;
}

interface CustomFields {
  data: FormDataFieldType;
  to: FormToFieldType;
  amount: FormAmountFieldType;
}

export interface UICustomizationContextPropsType {
  fields: CustomFields;
}

export const initialUICustomization: UICustomizationContextPropsType = {
  fields: {
    data: {
      classes: {
        container: 'form-group mb-0',
        label: 'pb-1',
        textarea: 'form-control',
        invalidTextarea: 'is-invalid',
        errorMsg: 'invalid-feedback'
      },
      label: '',
      ignoreDefaultClasses: false
    },
    to: {
      classes: {
        container: 'form-group',
        label: 'mb-2',
        inputContainer: 'notranslate typeahead',
        inputContainerError: 'is-invalid',
        invalidReceiverErrorMsg: 'invalid-feedback',
        scamErrorMsg: 'text-warning',
        scamErrorIcon: 'text-warning mr-1'
      },
      label: '',
      ignoreDefaultClasses: false
    },
    amount: {
      classes: {
        container: 'form-group amount',
        invalidInput: 'is-invalid',
        inputContainer: 'amount-holder',
        input: 'form-control amount-input',
        maxBtnContainer: 'd-flex align-content-center justify-content-end',
        maxBtn: 'btn btn-link',
        errorMsg: 'invalid-feedback'
      },
      label: '',
      components: {
        tokenSelector: null
      },
      ignoreDefaultClasses: false
    }
  }
};

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

const mergeCustomizer = (
  defaultData: any,
  newData: any,
  key: string,
  currentObject: any
) => {
  if (key === 'classes') {
    const result: any = {};

    for (const classKey of Object.keys(defaultData)) {
      if (currentObject.ignoreDefaultClasses) {
        result[classKey] = newData[classKey] || defaultData[classKey];
      } else {
        const stringToAdd = newData[classKey];
        if (stringToAdd && !defaultData[classKey].includes(stringToAdd)) {
          result[classKey] = `${defaultData[classKey]} ${stringToAdd}`;
        } else {
          result[classKey] = defaultData[classKey];
        }
      }
    }
    return result;
  }
};

export function useUICustomizationContext() {
  return useContext(UICustomizationContext);
}
