import { string } from 'yup';
import { ValidationSchemaType } from 'logic/types';

export const data = ({ ledger }: ValidationSchemaType) => {
  const ledgerDataActive = string().test(
    'ledgerDataActive',
    'Data option is disabled in the Ledger Elrond app',
    (value) => {
      if (ledger) {
        if (value && value.length && !ledger.ledgerDataActive) {
          return false;
        }
      }
      return true;
    }
  );

  // TODO: check ledger
  const hashSign = string().test(
    'hashSign',
    `Data too long. You need at least Elrond app version ${ledger?.ledgerHashSignMinimumVersion}. Update Elrond app to continue`,
    (value) => {
      if (ledger) {
        if (value && value.length > 300 && !ledger.ledgerWithHashSign) {
          return false;
        }
      }
      return true;
    }
  );

  const validations = [ledgerDataActive, hashSign];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default data;
