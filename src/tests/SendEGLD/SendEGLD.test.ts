import { fireEvent, waitFor } from '@testing-library/react';
import { testAddress } from '__mocks__';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';

describe('EGLD Amount field', () => {
  it('should not be empty', async () => {
    const { queryByText, findByTestId } = renderForm();
    const data = { target: { value: '' } };
    const input: any = await findByTestId(ValuesEnum.amount);
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.value).toBe('');
      const req = queryByText('Required');
      expect(req?.innerHTML).toBe('Required');
    });
  });
  it('should be numeric', async () => {
    const { findByTestId } = renderForm();
    const input: any = await findByTestId(ValuesEnum.amount);
    const value = 'asd';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    expect(input.value).toBe('');
  });
  it('should not allow hexadecimal', async () => {
    const { findByTestId } = renderForm();
    const input: any = await findByTestId(ValuesEnum.amount);
    const value = '0x1';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);

    expect(input.value).toBe('');
  });
  it('should show error when not enough balance for non-zero transaction with large gas', async () => {
    const render = renderForm({
      balance: '1_000_000_000_000_000'.replaceAll('_', '') // 0.001
    });

    const receiver: any = await render.findByTestId('receiver');

    fireEvent.change(receiver, { target: { value: testAddress } });

    const amount: any = await render.findByTestId(ValuesEnum.amount);
    fireEvent.change(amount, { target: { value: '0.00001' } });
    fireEvent.blur(amount, { target: { value: '0.00001' } });

    const gasLimit = render.getByTestId(ValuesEnum.gasLimit);
    fireEvent.change(gasLimit, { target: { value: '600000000' } });

    const sendButton = render.getByTestId('sendBtn');
    fireEvent.click(sendButton);
    await waitFor(() => {
      const amountError = render.getByTestId('amountError');
      expect(amountError.innerHTML).toBe('Insufficient funds');
      const gasLimitError = render.queryByTestId('gasLimitError');
      expect(gasLimitError).toBeNull();
    });
  });
});
