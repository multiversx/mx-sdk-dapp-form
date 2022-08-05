import { fireEvent, waitFor } from '@testing-library/react';
import { beforeAll } from 'tests/helpers/beforeAll';

describe('GasLimit field', () => {
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
  it('should not be empty', async () => {
    const { findByLabelText } = beforeAll();
    const input: any = await findByLabelText('Gas Limit');
    await waitFor(() => {
      expect(input.value).toBe('50000');
    });
  });
});
