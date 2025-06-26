import { waitFor } from '@testing-library/react';
import { testAddress } from '__mocks__';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

describe('EGLD Amount field', () => {
  it('should not be empty', async () => {
    const { queryByText, findByTestId } = renderForm();
    const data = { target: { value: '' } };
    const input: any = await findByTestId(ValuesEnum.amount);
    await userEvent.clear(input);
    await userEvent.type(input, data.target.value);
    await userEvent.tab();
    await sleep();
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
    await userEvent.clear(input);
    await userEvent.type(input, data.target.value);
    await userEvent.tab();
    await sleep();
    expect(input.value).toBe('');
  });
  it('should not allow hexadecimal', async () => {
    const { findByTestId } = renderForm();
    const input: any = await findByTestId(ValuesEnum.amount);
    const value = '0x1';
    const data = { target: { value } };
    await userEvent.clear(input);
    await userEvent.type(input, data.target.value);
    await userEvent.tab();
    await sleep();

    expect(input.value).toBe('0');
  });

  it('should show error when not enough balance for non-zero transaction with large gas', async () => {
    const render = renderForm({
      balance: '1_000_000_000_000_000'.replaceAll('_', '') // 0.001
    });

    const receiver: any = await render.findByTestId('receiver');

    await userEvent.clear(receiver);
    await userEvent.type(receiver, testAddress);
    await userEvent.tab();
    await sleep();

    const amount: any = await render.findByTestId(ValuesEnum.amount);
    await userEvent.clear(amount);
    await userEvent.type(amount, '0.00001');
    await userEvent.tab();
    await sleep();

    const gasLimit = render.getByTestId(ValuesEnum.gasLimit);
    await userEvent.clear(gasLimit);
    await userEvent.type(gasLimit, '600000000');
    await userEvent.tab();
    await sleep();

    const sendButton = render.getByTestId(FormDataTestIdsEnum.sendBtn);
    await userEvent.click(sendButton);
    await sleep();

    await waitFor(() => {
      const amountError = render.getByTestId('amountError');
      expect(amountError.innerHTML).toBe('Insufficient funds');
      const gasLimitError = render.queryByTestId('gasLimitError');
      expect(gasLimitError).toBeNull();
    });
  });
});
