import { fireEvent, waitFor } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';

describe('Destination address', () => {
  test('Destination address should not be empty', async () => {
    const { findByTestId, queryByText } = renderForm();

    const data = { target: { value: '' } };
    const input: any = await findByTestId('destinationAddress');

    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.value).toBe('');
      const req = queryByText('Required');
      expect(req!.innerHTML).toBe('Required');
    });
  });
  it('should validate address', async () => {
    const { findByTestId, queryByText } = renderForm();
    const input: any = await findByTestId('destinationAddress');
    const value = '123';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      const req = queryByText('Invalid address');
      expect(req!.innerHTML).toBe('Invalid address');
    });
  });
});
