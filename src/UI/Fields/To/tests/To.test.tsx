import { fireEvent, waitFor } from '@testing-library/react';
import { beforeAll } from 'tests/helpers/beforeAll';

describe('Destination address', () => {
  test('Destination address should not be empty', async () => {
    const { findByTestId, queryByText } = beforeAll();

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
  test('should validate address', async () => {
    const { findByTestId, queryByText } = beforeAll();
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
