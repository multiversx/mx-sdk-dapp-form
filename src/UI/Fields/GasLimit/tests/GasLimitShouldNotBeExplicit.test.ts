import { fireEvent, waitFor } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';

describe('GasLimit field', () => {
  it('should not allow explicit positive gasLimit', async () => {
    const { findByLabelText, queryByText } = renderForm();
    const input: any = await findByLabelText('Gas Limit');
    const value = '+1';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req?.innerHTML).toBeDefined();
    });
  });
});
