import { ValidationSchemaType, ValuesType } from 'logic/types';
import validationSchema from 'logic/validationSchema';

interface GetInitialErrorsType {
  validationSchemaProps: ValidationSchemaType;
  prefilledForm: boolean;
  initialValues: ValuesType;
}

export const getInitialErrors = ({
  validationSchemaProps,
  prefilledForm,
  initialValues
}: GetInitialErrorsType) => {
  if (!prefilledForm) {
    return {};
  }

  try {
    validationSchema(validationSchemaProps).validateSync(initialValues);
    return {};
  } catch ({ path, message }) {
    return {
      [String(path)]: message
    };
  }
};

export default getInitialErrors;
