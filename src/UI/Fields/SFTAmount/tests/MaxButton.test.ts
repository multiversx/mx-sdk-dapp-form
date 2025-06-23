import { waitFor } from '@testing-library/react';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { renderForm, sleep } from 'tests/helpers';
import { ValuesEnum } from 'types/form';
import userEvent from '@testing-library/user-event';

describe('Entire balance button', () => {
  test('Entering smaller amount than entireBalanceMinusDust shows Max', async () => {
    const render = renderForm();
    const amount = await render.findByTestId(ValuesEnum.amount);
    const value = { target: { value: '0.7122' } };
    await userEvent.type(amount, value.target.value);

    await waitFor(() => {
      const entireBalaceButton = render.getByTestId('maxBtn');
      expect(entireBalaceButton).toBeDefined();
    });
  });
  test('Entering larger amount than entireBalanceMinusDust hides Max', async () => {
    const render = renderForm();
    const amount = await render.findByTestId(ValuesEnum.amount);
    const value = { target: { value: '0.8074' } };

    await userEvent.type(amount, value.target.value);

    await waitFor(() => {
      const entireBalaceButton = render.queryByTestId('maxBtn');
      expect(entireBalaceButton).toBeNull();
    });
  });
  test('Pressing entire balance fills amount with balance - fee - minDust', async () => {
    const render = renderForm();
    const entireBalaceButton = await render.findByTestId('maxBtn');
    await userEvent.click(entireBalaceButton);
    await sleep(1000);

    const decreasedValue: any = await render.findByTestId(ValuesEnum.amount);
    expect(decreasedValue.value).toBe('0.8073');

    const infoDust = await render.findByTestId('infoDust');
    expect(infoDust).toBeDefined();

    const amount = render.getByTestId(ValuesEnum.amount);
    const value = { target: { value: '0' } };

    await userEvent.type(amount, value.target.value);

    const noInfoDust = render.queryByTestId('infoDust');
    expect(noInfoDust).toBeNull();
  });
  test('Using entire balance and writing in data filed triggers error', async () => {
    const methods = renderForm();
    const amount: any = await methods.findByTestId(ValuesEnum.amount);
    const value = { target: { value: '0.8123' } }; // max + 0.1 minDust

    await userEvent.type(amount, value.target.value);
    await userEvent.tab();

    const data = { target: { value: 'four' } };
    const input: any = await methods.findByTestId(ValuesEnum.data);
    await userEvent.type(input, data.target.value);
    const sendButton = await methods.findByTestId(FormDataTestIdsEnum.sendBtn);
    await userEvent.click(sendButton);

    await waitFor(() => {
      const req = methods.queryByText('Insufficient funds');
      expect(req?.innerHTML).toBe('Insufficient funds');
    });
  });
});
