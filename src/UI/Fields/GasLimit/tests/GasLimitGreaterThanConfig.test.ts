import { GAS_LIMIT } from '@multiversx/sdk-dapp/constants/index';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';

describe('GasLimit field', () => {
  it('should >= than the one set by config', async () => {
    const { findByLabelText, queryByText } = renderForm();
    const input: any = await findByLabelText('Gas Limit');
    const value = GAS_LIMIT - 1;
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);

    await waitFor(() => {
      const req = queryByText(/^Gas limit must be greater/);
      expect(req?.innerHTML).toBe(
        `Gas limit must be greater or equal to ${GAS_LIMIT}`
      );
    });
  });
});
