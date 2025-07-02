import { waitFor } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

describe('GasLimit field', () => {
  it('should be integer', async () => {
    const { findByLabelText, queryByText } = renderForm();

    const input = await findByLabelText('Gas Limit');
    const data = { target: { value: '0.1' } };

    await userEvent.clear(input);
    await userEvent.type(input, data.target.value);
    await userEvent.tab();
    await sleep();

    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req?.innerHTML).toBe('Invalid number');
    });
  });
});
