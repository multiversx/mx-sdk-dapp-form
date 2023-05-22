import { fireEvent } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';

describe('GasLimit field', () => {
  it('should not be string', async () => {
    const { findByLabelText, findByText } = renderForm();
    const input: any = await findByLabelText('Gas Limit');
    const value = 'string';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    const req = await findByText('Invalid number');
    expect(req?.innerHTML).toBe('Invalid number');
  });
});
