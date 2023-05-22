import { beforAllTokens, setupEsdtServer, useAmountInput } from './helpers';

describe('Send tokens', () => {
  beforeEach(setupEsdtServer);

  describe('Tokens amount', () => {
    test('Tokens amount111', async () => {
      const methods = beforAllTokens();
      const setInput = useAmountInput(methods);

      let input = await setInput('1.1234567890123456789');
      expect(input.value).toBe('1.1234567890123456789');

      input = await setInput('1100');
      const tokenAmountError = await methods.findByTestId('amountError');
      expect(tokenAmountError.textContent).toBe('Insufficient funds');
    });
  });
});
