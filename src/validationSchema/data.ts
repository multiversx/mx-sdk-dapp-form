import { string } from 'yup';
import { ledgerHashSignMinimumVersion } from 'constants/index';
import { getLedgerVersionOptions } from 'operations';
import { ExtendedValuesType, ValuesEnum } from 'types';
import { getCustomValidationRules } from 'validation/getCustomValidationRules';

const ledgerDataActive = string().test(
  'ledgerDataActive',
  'Data option is disabled in the Ledger Elrond app',
  function ledgerDataActiveCheck(value) {
    const { ledger } = this.parent as ExtendedValuesType;
    if (ledger) {
      if (value && value.length && !ledger.ledgerDataActive) {
        return false;
      }
    }
    return true;
  }
);

const hashSign = string().test({
  name: 'hashSign',
  test: function hashSignCheck(value) {
    const { ledger } = this.parent as ExtendedValuesType;

    if (ledger) {
      const { ledgerWithHashSign } = getLedgerVersionOptions(ledger.version);
      if (value && value.length > 300 && !ledgerWithHashSign) {
        return this.createError({
          message: `Data too long. You need at least Elrond app version ${ledgerHashSignMinimumVersion}. Update Elrond app to continue`,
          path: 'data'
        });
      }
    }
    return true;
  }
});

const validations = [
  ledgerDataActive,
  hashSign,
  getCustomValidationRules(ValuesEnum.data)
];

export const data = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default data;
