import { ExtendedValuesType, ValuesEnum } from 'types';

export const getIsDisabled = (
  field: keyof typeof ValuesEnum,
  readonly?: ExtendedValuesType['readonly']
) => {
  const isDisabled =
    typeof readonly === 'boolean'
      ? readonly
      : Array.isArray(readonly) && readonly.includes(field);
  return isDisabled;
};
