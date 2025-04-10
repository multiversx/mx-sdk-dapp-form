import {
    GAS_LIMIT,
    GAS_PER_DATA_BYTE
} from '@multiversx/sdk-dapp/constants/index';
import BigNumber from 'bignumber.js';
import { MULTISIG_GAS_LIMIT } from 'constants/index';
import { addMultisigGasLimit } from '../addMultisigGasLimit';
import { calculateGasLimit } from '../calculateGasLimit';
import { getGuardedAccountGasLimit } from '../getGuardedAccountGasLimit';

jest.mock('../addMultisigGasLimit');
jest.mock('../getGuardedAccountGasLimit');

describe('calculateGasLimit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getGuardedAccountGasLimit as jest.Mock).mockReturnValue('1000');
        (addMultisigGasLimit as jest.Mock).mockImplementation(
            ({ gasLimit, isDeposit }) => {
                return isDeposit
                    ? new BigNumber(gasLimit).plus(MULTISIG_GAS_LIMIT).toString(10)
                    : gasLimit;
            }
        );
    });

    it('should calculate gas limit correctly with no data', () => {
        const result = calculateGasLimit({
            data: '',
            isGuarded: false,
            isDeposit: false
        });

        expect(getGuardedAccountGasLimit).toHaveBeenCalledWith(false);
        expect(addMultisigGasLimit).toHaveBeenCalledWith({
            gasLimit: expect.any(String),
            isDeposit: false
        });
        expect(result).toBe(`${Number(GAS_LIMIT) + 1000}`);
    });

    it('should calculate gas limit correctly with data', () => {
        const data = 'test data';
        const dataLength = Buffer.from(data).length;
        const expectedGasValue = GAS_PER_DATA_BYTE * dataLength;
        const expectedGasLimit = GAS_LIMIT + expectedGasValue + 1000;

        const result = calculateGasLimit({
            data,
            isGuarded: false,
            isDeposit: false
        });

        expect(getGuardedAccountGasLimit).toHaveBeenCalledWith(false);
        expect(addMultisigGasLimit).toHaveBeenCalledWith({
            gasLimit: expectedGasLimit.toString(),
            isDeposit: false
        });
        expect(result).toBe(`${expectedGasLimit}`);
    });

    it('should add multisig gas limit when isDeposit is true', () => {
        const data = 'test data';
        const dataLength = Buffer.from(data).length;
        const expectedGasValue = GAS_PER_DATA_BYTE * dataLength;
        const expectedGasLimit = GAS_LIMIT + expectedGasValue + 1000;

        const result = calculateGasLimit({
            data,
            isGuarded: false,
            isDeposit: true
        });

        expect(getGuardedAccountGasLimit).toHaveBeenCalledWith(false);
        expect(addMultisigGasLimit).toHaveBeenCalledWith({
            gasLimit: expectedGasLimit.toString(),
            isDeposit: true
        });

        const expectedResult = new BigNumber(expectedGasLimit)
            .plus(MULTISIG_GAS_LIMIT)
            .toString(10);
        expect(result).toBe(expectedResult);
    });

    it('should add guarded account gas limit when isGuarded is true', () => {
        const data = 'test data';
        const dataLength = Buffer.from(data).length;
        const expectedGasValue = GAS_PER_DATA_BYTE * dataLength;
        const expectedGasLimit = GAS_LIMIT + expectedGasValue + 1000;

        const result = calculateGasLimit({
            data,
            isGuarded: true,
            isDeposit: false
        });

        expect(getGuardedAccountGasLimit).toHaveBeenCalledWith(true);
        expect(addMultisigGasLimit).toHaveBeenCalledWith({
            gasLimit: expectedGasLimit.toString(),
            isDeposit: false
        });
        expect(result).toBe(`${expectedGasLimit}`);
    });
});
