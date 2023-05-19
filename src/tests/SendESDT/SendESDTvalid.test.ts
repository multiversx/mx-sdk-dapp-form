import { act } from '@testing-library/react';
import { beforAllTokens, setupEsdtServer, useAmountInput } from './helpers';

describe('Tokens amount', () => {
  beforeEach(setupEsdtServer);

  test('Tokens amount valid', async () => {
    const methods = beforAllTokens();
    const setInput = useAmountInput(methods);

    const input: any = await setInput('1.12');
    expect(input.value).toBe('1.12');
    const data: any = await methods.findByTestId('data');

    await act(async () => {
      expect(data.value).toBe('ESDTTransfer@54574f2d383234653730@70');
      expect(data.disabled).toBeTruthy(); // check disabled
    });
  });
});
