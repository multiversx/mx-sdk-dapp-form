import { FormikErrors, FormikTouched } from 'formik';
import { ExtendedValuesType, ValuesEnum } from 'types';

// amount and gasLimit validation are interdependent
// this is why there is a separate function used to compute amount validation
export function getIsAmountInvalid({
  amount,
  errors,
  touched
}: {
  amount: string;
  errors: FormikErrors<ExtendedValuesType>;
  touched: FormikTouched<ExtendedValuesType>;
}) {
  const isAmountInvalid = Boolean(
    errors[ValuesEnum.amount] && touched[ValuesEnum.amount]
  );

  // if the amount is zero, let the insufficient funds error go to gasLimit
  const isInvalid = amount != '0' ? isAmountInvalid : false;
  return isInvalid;
}
