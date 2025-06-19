import { EXTRA_GAS_LIMIT_GUARDED_TX } from '@multiversx/sdk-dapp/out/constants';

export function getGuardedAccountGasLimit(isGuarded = false) {
  return isGuarded ? EXTRA_GAS_LIMIT_GUARDED_TX : 0;
}
