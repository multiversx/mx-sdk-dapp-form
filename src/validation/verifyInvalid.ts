import { FormikErrors, FormikTouched } from 'formik';
import { ValuesType } from 'logic/index';

export const verifyInvalid =
  ({
    shouldValidateForm,
    errors,
    touched
  }: {
    shouldValidateForm: boolean;
    errors: FormikErrors<ValuesType>;
    touched: FormikTouched<ValuesType>;
  }) =>
  (key: keyof ValuesType) =>
    Boolean(errors[key] && (touched[key] || shouldValidateForm));

export default verifyInvalid;
