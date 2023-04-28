import { fireEvent } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';

describe('EGLD Amount field', () => {
  it('should not be negative', async () => {
    const { findByTestId } = renderForm();
    const input: any = await findByTestId('amount');
    const value = '1';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    expect(input.value).toBe('1');
  });
});
