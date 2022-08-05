import { fireEvent, waitFor } from '@testing-library/react';
import { beforeAll } from 'tests/helpers/beforeAll';

describe('Amount field', () => {
  it('should not be empty', async () => {
    const { queryByText, findByTestId } = beforeAll();
    const data = { target: { value: '' } };
    const input: any = await findByTestId('amount');
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.value).toBe('');
      const req = queryByText('Required');
      expect(req!.innerHTML).toBe('Required');
    });
  });
  it('should be numeric', async () => {
    const { queryByText, findByTestId } = beforeAll();
    const input: any = await findByTestId('amount');
    const value = 'asd';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBe('Invalid number');
    });
  });
});
