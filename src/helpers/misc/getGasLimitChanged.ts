import { FormikTouched } from 'formik';
import { ExtendedValuesType } from 'types/form';

export const getGasLimitChanged = ({
  initialValues,
  gasLimit,
  touched
}: {
  initialValues: ExtendedValuesType;
  gasLimit: string;
  touched: FormikTouched<ExtendedValuesType>;
}) => initialValues.gasLimit !== gasLimit && touched.gasLimit;
