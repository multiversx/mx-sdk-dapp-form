import { ValuesType } from 'types';
import validationSchema from '../validationSchema';

interface GetInitialErrorsType {
  prefilledForm: boolean;
  initialValues: ValuesType;
}

export const getInitialErrors = ({
  prefilledForm,
  initialValues
}: GetInitialErrorsType) => {
  if (!prefilledForm) {
    return {};
  }

  try {
    validationSchema.validateSync(initialValues);
    return {};
  } catch ({ path, message }) {
    return {
      [String(path)]: message
    };
  }
};

export default getInitialErrors;
