import { fireEvent, waitFor } from '@testing-library/react';

import { testAddress } from '__mocks__';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';

describe('GasPrice field constraints tests', () => {
  it('should not be empty', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;

    expect(processedInput.value).toBe('0.000000001 xEGLD');
  });

  it('setting Gas limit + amount > balance should trigger error', async () => {
    const { getByLabelText, getByTestId, queryByText, findByTestId } =
      renderForm();

    const input = await findByTestId(ValuesEnum.amount);
    const value = '0.8123';
    const data = { target: { value } };
    fireEvent.change(input, data);

    const gasInput = getByLabelText('Gas Price (per Gas Unit)');
    const gasValue = 50001; // add 1 to the end
    fireEvent.change(gasInput, { target: { value: gasValue } });

    const sendButton = getByTestId(FormDataTestIdsEnum.sendBtn);
    fireEvent.click(sendButton);

    await waitFor(() => {
      const req = queryByText('Insufficient funds');
      expect(req?.innerHTML).toBe('Insufficient funds');
    });
  });

  it('should not show error when writing in data', async () => {
    const { getByLabelText, queryByText, getByText, findByTestId } =
      renderForm();

    const receiver = await findByTestId('receiver'); // TODO change to receiver
    fireEvent.change(receiver, { target: { value: testAddress } });
    fireEvent.blur(receiver);

    const entireBalaceButton = getByText('Max');
    fireEvent.click(entireBalaceButton);

    const feeLimit = await findByTestId(FormDataTestIdsEnum.feeLimit);
    fireEvent.click(feeLimit);

    const gasLimit = getByLabelText('Gas Price (per Gas Unit)');
    fireEvent.blur(gasLimit);

    const data = await findByTestId(ValuesEnum.data);
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
    const { getByTestId, queryByTestId, findByTestId } = renderForm({
      balance: '1_000_000_000_000_000'.replaceAll('_', '') // 0.001
    });

    const receiver = await findByTestId(ValuesEnum.receiver);
    fireEvent.change(receiver, { target: { value: testAddress } });

    const amount = getByTestId(ValuesEnum.amount);
    fireEvent.change(amount, { target: { value: '0' } });

    const gasLimit = getByTestId(ValuesEnum.gasLimit);
    fireEvent.change(gasLimit, { target: { value: '600000000' } });

    const sendButton = getByTestId(FormDataTestIdsEnum.sendBtn);
    fireEvent.click(sendButton);

    await waitFor(() => {
      const gasLimitError = getByTestId(FormDataTestIdsEnum.gasLimitError);
      expect(gasLimitError.innerHTML).toBe('Insufficient funds');
      const amountError = queryByTestId('amountError');
      expect(amountError).toBeNull();
    });
  });

  it('should keep the fee constant if gasLimit was touched', async () => {
    const { findByTestId, getByTestId } = renderForm({
      balance: '1_000_000_000_000_000'.replaceAll('_', '') // 0.001
    });

    const receiver = await findByTestId(ValuesEnum.receiver);
    fireEvent.change(receiver, { target: { value: testAddress } });

    const amount = getByTestId(ValuesEnum.amount);
    fireEvent.change(amount, { target: { value: '0' } });

    const gasLimit = getByTestId(ValuesEnum.gasLimit);
    fireEvent.change(gasLimit, { target: { value: '600000000' } });
    fireEvent.blur(gasLimit, { target: { value: '600000000' } });

    async function expectCorrectFee() {
      const formatAmountInt = await findByTestId(
        FormDataTestIdsEnum.formatAmountInt
      );
      const formatAmountDecimal = await findByTestId(
        FormDataTestIdsEnum.formatAmountDecimals
      );

      expect(formatAmountInt.innerHTML).toBe('0');
      expect(formatAmountDecimal.innerHTML).toBe('.0060');
    }

    expectCorrectFee();

    const data = await findByTestId(ValuesEnum.data);
    fireEvent.change(data, { target: { value: '12345678' } });
    expectCorrectFee();
  });
});
