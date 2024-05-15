import { ValuesType } from 'types';
import { ValidationErrorMessagesType } from '../types/validation';
import { getValidationSchema } from '../validationSchema';

interface GetInitialErrorsType {
  prefilledForm: boolean;
  initialValues?: ValuesType;
  errorMessages: ValidationErrorMessagesType;
}

export const getInitialErrors = ({
  prefilledForm,
  initialValues,
  errorMessages
}: GetInitialErrorsType) => {
  if (!prefilledForm || !initialValues) {
    return {};
  }

  try {
    getValidationSchema(errorMessages).validateSync(initialValues);
    return {};
  } catch (error) {
    const { path, message } = error as { path: string; message: string };

    return {
      [String(path)]: message
    };
  }
};

export default getInitialErrors;
