import {
  LEDGER_HASH_SIGN_MINIMUM_VERSION,
  LEDGER_WITH_GUARDIANS_MINIMUM_VERSION
} from '@multiversx/sdk-dapp/out/constants/ledger.constants';
import getLedgerVersionOptions from '@multiversx/sdk-dapp/out/providers/strategies/LedgerProviderStrategy/helpers/getLedgerVersionOptions';
import { string } from 'yup';
import { ExtendedValuesType } from 'types';

const ledgerDataActive = string().test(
  'ledgerDataActive',
  'Data option is disabled in the Ledger MultiversX app',
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
    const { ledger, isGuarded } = this.parent as ExtendedValuesType;

    if (ledger) {
      const { ledgerWithHashSign, ledgerWithGuardians } =
        getLedgerVersionOptions(ledger.version);
      if (value && value.length > 300 && !ledgerWithHashSign) {
        return this.createError({
          message: `Data too long. You need at least MultiversX app version ${LEDGER_HASH_SIGN_MINIMUM_VERSION}. Update MultiversX app to continue`,
          path: 'data'
        });
      }
      if (isGuarded && !ledgerWithGuardians) {
        return this.createError({
          message: `You need at least MultiversX app version ${LEDGER_WITH_GUARDIANS_MINIMUM_VERSION} to use Guardians`,
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
