import { GAS_LIMIT } from '@multiversx/sdk-dapp/out/constants';
import { waitFor } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

describe('GasLimit field', () => {
  it('should >= than the one set by config', async () => {
    const { findByLabelText, queryByText } = renderForm();

    const input = await findByLabelText('Gas Limit');
    const value = GAS_LIMIT - 1;
    const data = { target: { value } };

    await userEvent.clear(input);
    await userEvent.type(input, data.target.value.toString());
    await userEvent.tab();
    await sleep(1000);

    await waitFor(() => {
      const req = queryByText(/^Gas limit must be greater/);
      expect(req?.innerHTML).toBe(
        `Gas limit must be greater or equal to ${GAS_LIMIT}`
      );
    });
  });
});
