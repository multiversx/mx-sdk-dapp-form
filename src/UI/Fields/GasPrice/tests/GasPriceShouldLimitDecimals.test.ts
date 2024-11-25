import { fireEvent, waitFor } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';

describe('GasPrice field', () => {
  it('should limit decimals under 18', async () => {
    const { findByLabelText, queryByText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '0.1234567891234567890' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    await waitFor(() => {
      const req = queryByText('Maximum 18 decimals allowed');
      expect(req?.innerHTML).toBe('Maximum 18 decimals allowed');
    });
  });
});
