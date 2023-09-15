import { useSendFormContext } from 'contexts';
import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';

export const useIsDataDisabled = () => {
  const {
    formInfo: { isEgldTransaction, readonly }
  } = useSendFormContext();

  const isDataDisabled =
    !isEgldTransaction || getIsDisabled(ValuesEnum.data, readonly);

  return isDataDisabled;
};
