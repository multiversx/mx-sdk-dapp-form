import { FormikErrors, FormikTouched } from 'formik';
import { ExtendedValuesType } from 'types';

export const verifyInvalid = ({
  shouldValidateForm,
  errors,
  touched
}: {
  shouldValidateForm: boolean;
  errors: FormikErrors<ExtendedValuesType>;
  touched: FormikTouched<ExtendedValuesType>;
}) => (key: keyof ExtendedValuesType) =>
  Boolean(errors[key] && (touched[key] || shouldValidateForm));

export default verifyInvalid;
