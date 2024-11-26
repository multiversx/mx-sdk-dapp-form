import { fireEvent, waitFor } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';

describe('GasLimit field', () => {
  it('should be integer', async () => {
    const { findByLabelText, queryByText } = renderForm();

    const input = await findByLabelText('Gas Limit');
    const data = { target: { value: '0.1' } };

    fireEvent.change(input, data);
    fireEvent.blur(input);

    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req?.innerHTML).toBe('Invalid number');
    });
  });
});
