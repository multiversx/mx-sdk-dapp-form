import { FormikErrors, FormikTouched } from 'formik';
import { ExtendedValuesType, TxTypeEnum, ValuesEnum } from 'types';

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
  if (values.txType === TxTypeEnum.EGLD) {
    const isInvalid = values.amount != '0' ? isAmountInvalid : false;
    return isInvalid;
  }

  return isAmountInvalid;
}
