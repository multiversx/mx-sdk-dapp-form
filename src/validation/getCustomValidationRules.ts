import { string, AnySchema } from 'yup';
import { ValuesEnum, ExtendedValuesType } from 'types';

export const getCustomValidationRules = (field: ValuesEnum) => {
  const customRulesSchema = string().when(['customValidationRules'], function(
    customValidationRules: ExtendedValuesType['customValidationRules'],
    schema: AnySchema
  ) {
    const validationFunctions = customValidationRules?.[field];
    if (validationFunctions) {
      const testFunctions = validationFunctions.reduce(
        (previousValue, { message, test, name }) =>
          previousValue.concat(string().test({ name, message, test })),
        string()
      );
      return schema.concat(testFunctions);
    }
    return schema;
  });
  return customRulesSchema;
};
