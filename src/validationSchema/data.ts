import { string } from 'yup';
import { ExtendedValuesType } from 'types';

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

// TODO: check ledger
const hashSign = string().test({
  name: 'hashSign',
  test: function hashSignCheck(value) {
    const { ledger } = this.parent as ExtendedValuesType;

    if (ledger) {
      if (value && value.length > 300 && !ledger.ledgerWithHashSign) {
        return this.createError({
          message: `Data too long. You need at least Elrond app version ${ledger?.ledgerHashSignMinimumVersion}. Update Elrond app to continue`,
          path: 'data'
        });
      }
    }
    return true;
  }
});

const validations = [ledgerDataActive, hashSign];

export const data = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default data;
