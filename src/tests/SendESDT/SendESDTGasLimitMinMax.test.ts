import { waitFor } from '@testing-library/react';

import { beforAllTokens, setupEsdtServer, useGasLimitInput } from './helpers';

describe('Tokens gasLimit', () => {
  beforeEach(setupEsdtServer);

  test('Tokens gasLimit min and max', async () => {
    const methods = beforAllTokens();
    const setInput = useGasLimitInput(methods);

    const input = await setInput('1');
    expect(input.value).toBe('1');

    let gasLimitError = await methods.findByTestId('gasLimitError');
    expect(gasLimitError.textContent).toBe(
      'Gas limit must be greater or equal to 500000'
    );

    await setInput('5000000000');
    gasLimitError = await methods.findByTestId('gasLimitError');

    await waitFor(() => {
      expect(gasLimitError.textContent).toBe('Must be lower than 600000000');
    });
  });
});
