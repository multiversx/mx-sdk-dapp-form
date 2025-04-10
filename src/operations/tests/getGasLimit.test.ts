import BigNumber from 'bignumber.js';
import { MULTISIG_GAS_LIMIT, TOKEN_GAS_LIMIT } from 'constants/index';
import { TransactionTypeEnum } from 'types/enums';
import { addMultisigGasLimit } from '../addMultisigGasLimit';
import { calculateGasLimit } from '../calculateGasLimit';
import { calculateNftGasLimit } from '../calculateNftGasLimit';
import { getGasLimit } from '../getGasLimit';
import { getGuardedAccountGasLimit } from '../getGuardedAccountGasLimit';

// Mock dependencies
jest.mock('../calculateGasLimit');
jest.mock('../calculateNftGasLimit');
jest.mock('../getGuardedAccountGasLimit');
jest.mock('../addMultisigGasLimit');

describe('getGasLimit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (calculateNftGasLimit as jest.Mock).mockReturnValue('50000');
        (calculateGasLimit as jest.Mock).mockReturnValue('60000');
        (getGuardedAccountGasLimit as jest.Mock).mockReturnValue('1000');
        (addMultisigGasLimit as jest.Mock).mockImplementation(
            ({ gasLimit, isDeposit }) => {
                return isDeposit
                    ? new BigNumber(gasLimit).plus(MULTISIG_GAS_LIMIT).toString(10)
                    : gasLimit;
            }
        );
    });

    it('should return NFT gas limit by default', () => {
        const result = getGasLimit({
            txType: TransactionTypeEnum.NonFungibleESDT,
            isGuarded: false,
            isDeposit: false
        });

        expect(calculateNftGasLimit).toHaveBeenCalled();
        expect(calculateGasLimit).not.toHaveBeenCalled();
        expect(getGuardedAccountGasLimit).toHaveBeenCalledWith(false);
        expect(addMultisigGasLimit).toHaveBeenCalledWith({
            gasLimit: '50000',
            isDeposit: false
        });
        expect(result).toBe('51000');
    });

    it('should return TOKEN_GAS_LIMIT for ESDT transaction type', () => {
        const result = getGasLimit({
            txType: TransactionTypeEnum.ESDT,
            isGuarded: false,
            isDeposit: false
        });

        expect(calculateGasLimit).not.toHaveBeenCalled();
        expect(getGuardedAccountGasLimit).toHaveBeenCalledWith(false);
        expect(addMultisigGasLimit).toHaveBeenCalledWith({
            gasLimit: TOKEN_GAS_LIMIT,
            isDeposit: false
        });
        expect(result).toBe(`${Number(TOKEN_GAS_LIMIT) + 1000}`);
    });

    it('should call calculateGasLimit for EGLD transaction type', () => {
        const data = 'test data';
        const result = getGasLimit({
            txType: TransactionTypeEnum.EGLD,
            data,
            isGuarded: false,
            isDeposit: false
        });

        expect(calculateGasLimit).toHaveBeenCalledWith({
            data: data.trim()
        });
        expect(getGuardedAccountGasLimit).toHaveBeenCalledWith(false);
        expect(addMultisigGasLimit).toHaveBeenCalledWith({
            gasLimit: '60000',
            isDeposit: false
        });
        expect(result).toBe('61000');
    });

    it('should add multisig gas limit when isDeposit is true', () => {
        const result = getGasLimit({
            txType: TransactionTypeEnum.NonFungibleESDT,
            isGuarded: false,
            isDeposit: true
        });

        expect(calculateNftGasLimit).toHaveBeenCalled();
        expect(calculateGasLimit).not.toHaveBeenCalled();
        expect(getGuardedAccountGasLimit).toHaveBeenCalledWith(false);
        expect(addMultisigGasLimit).toHaveBeenCalledWith({
            gasLimit: '50000',
            isDeposit: true
        });

        // Calculate the expected result
        const expectedGasLimit = new BigNumber('50000')
            .plus(MULTISIG_GAS_LIMIT)
            .plus('1000')
            .toString(10);
        expect(result).toBe(expectedGasLimit);
    });

    it('should add guarded account gas limit when isGuarded is true', () => {
        const result = getGasLimit({
            txType: TransactionTypeEnum.NonFungibleESDT,
            isGuarded: true,
            isDeposit: false
        });

        expect(calculateNftGasLimit).toHaveBeenCalled();
        expect(calculateGasLimit).not.toHaveBeenCalled();
        expect(getGuardedAccountGasLimit).toHaveBeenCalledWith(true);
        expect(addMultisigGasLimit).toHaveBeenCalledWith({
            gasLimit: '50000',
            isDeposit: false
        });
        expect(result).toBe('51000');
    });
});
