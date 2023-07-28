import { fireEvent, waitFor } from '@testing-library/react';
import { testAddress } from '__mocks__';
import { formattedAmountSelector } from 'tests/helpers';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';

describe('GasLimit field', () => {
  it('should not be empty', async () => {
    const methods = renderForm();
    const input: any = await methods.findByLabelText('Gas Limit');
    expect(input.value).toBe('50000');
  });
  it('setting Gas limit + amount > balance should trigger error', async () => {
    const { getByLabelText, getByTestId, queryByText, findByTestId } =
      renderForm();
    const input: any = await findByTestId('amount');
    const value = '0.8123';
    const data = { target: { value } };
    fireEvent.change(input, data);

    const gasInput: any = getByLabelText('Gas Limit');
    const gasValue = 50001; // add 1 to the end
    fireEvent.change(gasInput, { target: { value: gasValue } });

    const sendButton = getByTestId('sendBtn');
    fireEvent.click(sendButton);
    await waitFor(() => {
      const req = queryByText('Insufficient funds');
      expect(req?.innerHTML).toBe('Insufficient funds');
    });
  });
  it('should not show error when writing in data', async () => {
    const methods = renderForm();

    const { getByLabelText, queryByText, getByText, findByTestId } = methods;

    const receiver: any = await findByTestId('receiver'); // TODO change to receiver
    fireEvent.change(receiver, { target: { value: testAddress } });
    fireEvent.blur(receiver);

    const entireBalaceButton = getByText('Max');
    fireEvent.click(entireBalaceButton);

    const feeLimit = await findByTestId('feeLimit');
    fireEvent.click(feeLimit);

    const gasLimit: any = getByLabelText('Gas Limit');
    fireEvent.blur(gasLimit);

    const data = await findByTestId('data');
    fireEvent.change(data, { target: { value: '123' } });
    fireEvent.keyUp(data);

    await waitFor(() => {
      const req = queryByText(/^Gas limit must be greater/);
      expect(req).toBe(null);
    });

    const usdValue = await findByTestId('tokenPrice_58.14');

    expect(usdValue).toBeDefined();
  });
  it('should show error when not enough balance for zero transaction with large gas', async () => {
    const methods = renderForm({
      balance: '1_000_000_000_000_000'.replaceAll('_', '') // 0.001
    });

    const receiver: any = await methods.findByTestId(ValuesEnum.receiver);
    fireEvent.change(receiver, { target: { value: testAddress } });

    const amount = methods.getByTestId('amount');
    fireEvent.change(amount, { target: { value: '0' } });

    const gasLimit = methods.getByTestId('gasLimit');
    fireEvent.change(gasLimit, { target: { value: '600000000' } });

    const sendButton = methods.getByTestId('sendBtn');
    fireEvent.click(sendButton);

    await waitFor(() => {
      const gasLimitError = methods.getByTestId('gasLimitError');
      expect(gasLimitError.innerHTML).toBe('Insufficient funds');
      const amountError = methods.queryByTestId('amountError');
      expect(amountError).toBeNull();
    });
  });
  it('should keep the fee constant if gasLimit was touched', async () => {
    async function expectCorrectFee() {
      const feeLimit = await methods.findByTestId('feeLimit');
      expect(formattedAmountSelector(feeLimit).intAmount).toBe('0');
      expect(formattedAmountSelector(feeLimit).decimalAmount).toBe('.0060495');
    }

    const methods = renderForm({
      balance: '1_000_000_000_000_000'.replaceAll('_', '') // 0.001
    });

    const receiver: any = await methods.findByTestId(ValuesEnum.receiver);
    fireEvent.change(receiver, { target: { value: testAddress } });

    const amount = methods.getByTestId('amount');
    fireEvent.change(amount, { target: { value: '0' } });

    const gasLimit = methods.getByTestId('gasLimit');
    fireEvent.change(gasLimit, { target: { value: '600000000' } });
    fireEvent.blur(gasLimit, { target: { value: '600000000' } });

    expectCorrectFee();

    const data = await methods.findByTestId('data');
    fireEvent.change(data, { target: { value: '12345678' } });

    expectCorrectFee();
  });
});
