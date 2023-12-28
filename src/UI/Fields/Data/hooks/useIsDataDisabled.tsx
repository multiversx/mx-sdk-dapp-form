import { useSendFormContext } from 'contexts';
import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';

export const useIsDataDisabled = () => {
  const {
    formInfo: { isEgldTransaction, readonly },
    dataFieldInfo: { isAdvancedModeEnabled }
  } = useSendFormContext();

  if (isAdvancedModeEnabled) {
    return false;
  }

  return !isEgldTransaction || getIsDisabled(ValuesEnum.data, readonly);
};
