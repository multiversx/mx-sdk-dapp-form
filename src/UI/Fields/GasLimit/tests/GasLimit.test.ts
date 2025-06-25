import { waitFor } from '@testing-library/react';

import { testAddress } from '__mocks__/accountConfig';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

describe('GasLimit field', () => {
  it('should not be empty', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Limit');
    const processedInput = input as HTMLInputElement;

    expect(processedInput.value).toBe('50,000');
  });

  it('setting Gas limit + amount > balance should trigger error', async () => {
    const { findByTestId } = renderForm({
      balance: '1'
    });

    const receiver = await findByTestId(ValuesEnum.receiver);
    await userEvent.clear(receiver);
    await userEvent.type(receiver, testAddress);
    await userEvent.tab();
    await sleep(1500);

    const amount = await findByTestId(ValuesEnum.amount);
    await userEvent.clear(amount);
    await userEvent.type(amount, '0.000000000000000001');
    await userEvent.tab();
    await sleep(1500);

    const gasLimit = await findByTestId(ValuesEnum.gasLimit);
    await userEvent.clear(gasLimit);
    await userEvent.type(gasLimit, '50001');
    await userEvent.tab();
    await sleep(1500);

    const sendButton = await findByTestId(FormDataTestIdsEnum.sendBtn);
    await userEvent.click(sendButton);
    await sleep(1500);

    await waitFor(async () => {
      const amountError = await findByTestId(FormDataTestIdsEnum.amountError);
      expect(amountError.textContent).toBe('Insufficient funds');
    });
  });

  it('should not show error when writing in data', async () => {
    const { queryByText, getByText, findByTestId } = renderForm();

    const receiver = await findByTestId(ValuesEnum.receiver);
    await userEvent.clear(receiver);
    await userEvent.type(receiver, testAddress);
    await userEvent.tab();
    await sleep(1000);

    const entireBalaceButton = getByText('Max');
    await userEvent.click(entireBalaceButton);
    await sleep(1000);

    const feeLimit = await findByTestId(FormDataTestIdsEnum.feeLimit);
    await userEvent.click(feeLimit);
    await sleep(1000);

    const data = await findByTestId(ValuesEnum.data);
    await userEvent.clear(data);
    await userEvent.type(data, '123');
    await userEvent.tab();
    await sleep(1000);

    await waitFor(() => {
      const req = queryByText(/^Gas limit must be greater/);
      expect(req).toBe(null);
    });

    const usdValue = await findByTestId('tokenPrice_58.14');
    expect(usdValue).toBeDefined();
  });

  it('should show error when not enough balance for zero transaction with large gas', async () => {
    const { findByTestId, getByTestId } = renderForm({
      balance: '1'
    });

    const receiver = await findByTestId(ValuesEnum.receiver);
    await userEvent.clear(receiver);
    await userEvent.type(receiver, testAddress);
    await userEvent.tab();
    await sleep(1500);

    const amount = getByTestId(ValuesEnum.amount);
    await userEvent.clear(amount);
    await userEvent.type(amount, '0');
    await userEvent.tab();
    await sleep(1500);

    const gasLimit = getByTestId(ValuesEnum.gasLimit);
    await userEvent.clear(gasLimit);
    await userEvent.type(gasLimit, '50000');
    await userEvent.tab();
    await sleep(1500);

    const sendButton = getByTestId(FormDataTestIdsEnum.sendBtn);
    await userEvent.click(sendButton);
    await sleep(1500);

    await waitFor(async () => {
      const gasLimitError = await findByTestId(
        FormDataTestIdsEnum.gasLimitError
      );
      expect(gasLimitError.textContent).toBe('Insufficient funds');
    });
  });

  it('should keep the fee constant if gasLimit was touched', async () => {
    const { findByTestId, getByTestId } = renderForm({
      balance: '1_000_000_000_000_000'.replaceAll('_', '') // 0.001
    });

    const receiver = await findByTestId(ValuesEnum.receiver);
    await userEvent.clear(receiver);
    await userEvent.type(receiver, testAddress);
    await userEvent.tab();
    await sleep(1000);

    const amount = getByTestId(ValuesEnum.amount);
    await userEvent.clear(amount);
    await userEvent.type(amount, '0');
    await userEvent.tab();
    await sleep(1000);

    const gasLimit = getByTestId(ValuesEnum.gasLimit);
    await userEvent.clear(gasLimit);
    await userEvent.type(gasLimit, '600000000');
    await userEvent.tab();
    await sleep(1000);

    async function expectCorrectFee() {
      const formatAmountInt = await findByTestId(
        FormDataTestIdsEnum.formatAmountInt
      );
      const formatAmountDecimal = await findByTestId(
        FormDataTestIdsEnum.formatAmountDecimals
      );

      expect(formatAmountInt.innerHTML).toBe('0');
      expect(formatAmountDecimal.innerHTML).toBe('.0060495');
    }

    expectCorrectFee();

    const data = await findByTestId(ValuesEnum.data);
    await userEvent.clear(data);
    await userEvent.type(data, '12345678');
    await userEvent.tab();
    await sleep(1000);

    expectCorrectFee();
  });
});
