import { string, StringSchema } from 'yup';

/**
 * Merges a list of single-purpose string schemas into one.
 *
 * Requiredness is applied after the merge instead of being one of the concatenated
 * schemas: since yup 1.x, `concat` takes the optionality of the right-hand schema, so a
 * `required` piece placed anywhere but last has its flag silently dropped by the schemas
 * that follow it.
 */
export const concatValidations = (
  validations: StringSchema[],
  requiredMessage?: string
) => {
  const merged = validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );

  return requiredMessage ? merged.required(requiredMessage) : merged;
};

export default concatValidations;
