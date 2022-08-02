import { fireEvent, waitFor } from '@testing-library/react';
import { beforeAll } from './helpers';

describe('Destination address', () => {
  it('Destination address should not be empty', async () => {
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
});
