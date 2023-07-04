import { waitFor } from '@testing-library/react';
import { MAX_GAS_LIMIT, TOKEN_GAS_LIMIT } from 'constants/index';
import { defaultErrorMessages } from 'validation/defaultErrorMessages';

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
      defaultErrorMessages.tooLowGasLimit(TOKEN_GAS_LIMIT)
    );

    await setInput('5000000000');
    gasLimitError = await methods.findByTestId('gasLimitError');

    await waitFor(() => {
      expect(gasLimitError.textContent).toBe(
        defaultErrorMessages.tooHighGasLimit(MAX_GAS_LIMIT)
      );
    });
  });
});
