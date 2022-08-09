import { act, fireEvent, waitFor } from '@testing-library/react';
import { beforeAll } from 'tests/helpers';

describe('Entire balance button', () => {
  test('Entering smaller amount than entireBalanceMinusDust shows Max', async () => {
    const render = beforeAll();
    const amount = await render.findByTestId('amount');
    const value = { target: { value: '0.7122' } };
    await act(async () => {
      fireEvent.change(amount, value);
    });

    await waitFor(() => {
      const entireBalaceButton = render.getByTestId('maxBtn');
      expect(entireBalaceButton).toBeDefined();
    });
  });
  test('Entering larger amount than entireBalanceMinusDust hides Max', async () => {
    const render = beforeAll();
    const amount = await render.findByTestId('amount');
    const value = { target: { value: '0.8074' } };

    await act(async () => {
      fireEvent.change(amount, value);
    });

    await waitFor(() => {
      const entireBalaceButton = render.queryByTestId('maxBtn');
      expect(entireBalaceButton).toBeNull();
    });
  });
  test('Pressing entire balance fills amount with balance - fee - minDust', async () => {
    const render = beforeAll();
    const entireBalaceButton = await render.findByTestId('maxBtn');
    fireEvent.click(entireBalaceButton);

    const decreasedValue: any = render.getByTestId('amount');
    expect(decreasedValue.value).toBe('0.8073');

    const infoDust = render.getByTestId('infoDust');
    expect(infoDust).toBeDefined();

    const amount = render.getByTestId('amount');
    const value = { target: { value: '0' } };

    await act(async () => {
      fireEvent.change(amount, value);
    });

    const noInfoDust = render.queryByTestId('infoDust');
    expect(noInfoDust).toBeNull();
  });
  test('Using entire balance and writing in data filed triggers error', async () => {
    const methods = beforeAll();
    const amount: any = await methods.findByTestId('amount');
    const value = { target: { value: '0.8123' } }; // max + 0.1 minDust

    await act(async () => {
      fireEvent.change(amount, value);
    });

    fireEvent.change(amount, value);
    fireEvent.blur(amount);
    const data = { target: { value: 'four' } };
    const input: any = await methods.findByTestId('data');
    fireEvent.change(input, data);
    const sendButton = methods.getByTestId('sendBtn');
    fireEvent.click(sendButton);

    await waitFor(() => {
      const req = methods.queryByText('Insufficient funds');
      expect(req!.innerHTML).toBe('Insufficient funds');
    });
  });
});
