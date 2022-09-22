import { UICustomizationContextPropsType } from 'contexts/UICustomization';

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
      label: 'Data',
      ignoreDefaultClasses: false
    },
    receiver: {
      classes: {
        container: 'form-group',
        label: 'mb-2',
        inputContainer: 'notranslate typeahead',
        inputContainerError: 'is-invalid',
        invalidReceiverErrorMsg: 'invalid-feedback',
        scamErrorMsg: 'text-warning',
        scamErrorIcon: 'text-warning mr-1'
      },
      label: 'Receiver',
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
      label: 'Amount',
      components: {
        tokenSelector: null
      },
      ignoreDefaultClasses: false
    }
  }
};

export const mergeCustomizer = (
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
