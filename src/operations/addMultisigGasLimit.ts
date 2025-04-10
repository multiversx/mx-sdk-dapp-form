import BigNumber from 'bignumber.js';
import { MULTISIG_GAS_LIMIT } from 'constants/index';

export const addMultisigGasLimit = ({
    gasLimit,
    isDeposit
}: {
    gasLimit: string | number;
    isDeposit?: boolean;
}): string => {
    if (!isDeposit) {
        return gasLimit.toString();
    }

    return new BigNumber(gasLimit).plus(MULTISIG_GAS_LIMIT).toString(10);
};
