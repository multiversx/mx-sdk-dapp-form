import { fireEvent, waitFor } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';

describe('EGLD Amount field', () => {
  it('should be =< than balance - transaction fee', async () => {
    const { queryByText, findByTestId, getByTestId } = renderForm();
    const input: any = await findByTestId('amount');
    const value = '9,999,979.9998';

    const fullBalance = { target: { value } };
    fireEvent.change(input, fullBalance);
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input.value).toBe(value);
    });

    const sendButton = getByTestId('sendBtn');
    fireEvent.click(sendButton);

    await waitFor(() => {
      const req = queryByText('Insufficient funds');
      expect(req?.innerHTML).toBe('Insufficient funds');
    });
  });
});
