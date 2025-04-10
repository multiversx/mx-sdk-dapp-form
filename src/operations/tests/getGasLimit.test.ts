import { TOKEN_GAS_LIMIT } from 'constants/index';
import { TransactionTypeEnum } from 'types/enums';
import { getGasLimit } from '../getGasLimit';

describe('getGasLimit', () => {
  it('should return NFT gas limit by default', () => {
    const result = getGasLimit({
      txType: TransactionTypeEnum.NonFungibleESDT,
      isGuarded: false,
      isDeposit: false
    });

    expect(result).toBe('1000000');
  });

  it('should return TOKEN_GAS_LIMIT for ESDT transaction type', () => {
    const result = getGasLimit({
      txType: TransactionTypeEnum.ESDT,
      isGuarded: false,
      isDeposit: false
    });

    expect(result).toBe(TOKEN_GAS_LIMIT.toString());
  });

  it('should call calculateGasLimit for EGLD transaction type', () => {
    const data = 'test data';
    const result = getGasLimit({
      txType: TransactionTypeEnum.EGLD,
      data,
      isGuarded: false,
      isDeposit: false
    });

    expect(result).toBe('63500');
  });

  it('should add multisig gas limit when isDeposit is true', () => {
    const result = getGasLimit({
      txType: TransactionTypeEnum.NonFungibleESDT,
      isGuarded: false,
      isDeposit: true
    });

    expect(result).toBe('26000000');
  });

  it('should add guarded account gas limit when isGuarded is true', () => {
    const result = getGasLimit({
      txType: TransactionTypeEnum.NonFungibleESDT,
      isGuarded: true,
      isDeposit: false
    });

    expect(result).toBe('1050000');
  });
});
