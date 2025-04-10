import { GAS_LIMIT } from '@multiversx/sdk-dapp/constants/index';
import { calculateGasLimit } from '../calculateGasLimit';

describe('calculateGasLimit', () => {
  it('should calculate gas limit correctly with no data', () => {
    const result = calculateGasLimit({
      data: '',
      isGuarded: false,
      isDeposit: false
    });

    expect(result).toBe(GAS_LIMIT.toString());
  });

  it('should calculate gas limit correctly with data', () => {
    const data = 'test data';

    const result = calculateGasLimit({
      data,
      isGuarded: false,
      isDeposit: false
    });

    expect(result).toBe('63500');
  });

  it('should add multisig gas limit when isDeposit is true', () => {
    const data = 'test data';

    const result = calculateGasLimit({
      data,
      isGuarded: false,
      isDeposit: true
    });

    expect(result).toBe('25063500');
  });

  it('should add guarded account gas limit when isGuarded is true', () => {
    const data = 'test data';

    const result = calculateGasLimit({
      data,
      isGuarded: true,
      isDeposit: false
    });

    expect(result).toBe('113500');
  });
});
