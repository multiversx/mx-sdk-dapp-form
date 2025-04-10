import BigNumber from 'bignumber.js';
import { MULTISIG_GAS_LIMIT } from 'constants/index';

/**
 * Adds MULTISIG_GAS_LIMIT to the gas limit if isDeposit is true
 * @param gasLimit The base gas limit
 * @param isDeposit Whether the transaction is a deposit
 * @returns The gas limit with MULTISIG_GAS_LIMIT added if isDeposit is true
 */
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
