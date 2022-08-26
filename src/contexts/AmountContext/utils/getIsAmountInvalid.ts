import { FormikErrors, FormikTouched } from 'formik';
import { ZERO } from 'constants/index';
import { ExtendedValuesType, TransactionTypeEnum, ValuesEnum } from 'types';

// amount and gasLimit validation are interdependent
// this is why there is a separate function used to compute amount validation
export function getIsAmountInvalid({
  values,
  errors,
  touched
}: {
  values: ExtendedValuesType;
  errors: FormikErrors<ExtendedValuesType>;
  touched: FormikTouched<ExtendedValuesType>;
}) {
  const isAmountInvalid = Boolean(
    errors[ValuesEnum.amount] && touched[ValuesEnum.amount]
  );

  // if the EGLD amount is zero, let the insufficient funds error go to gasLimit
  if (values.txType === TransactionTypeEnum.EGLD) {
    const isInvalid = values.amount != ZERO ? isAmountInvalid : false;
    return isInvalid;
  }

  return isAmountInvalid;
}
