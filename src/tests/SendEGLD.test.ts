import { fireEvent, waitFor } from '@testing-library/react';
import { testAddress } from '__mocks__';
import { renderForm } from 'tests/helpers/renderForm';

describe('EGLD Amount field', () => {
  it('should not be empty', async () => {
    const { queryByText, findByTestId } = renderForm();
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
    const { queryByText, findByTestId } = renderForm();
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
  it('should not be negative', async () => {
    const { queryByText, findByTestId } = renderForm();
    const input: any = await findByTestId('amount');
    const value = '-1';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBeDefined();
    });
  });
  it('should not be explicit positive', async () => {
    const { queryByText, findByTestId } = renderForm();
    const input: any = await findByTestId('amount');
    const value = '+1';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBeDefined();
    });
  });
  it('should not allow exponential', async () => {
    const { queryByText, findByTestId } = renderForm();
    const input: any = await findByTestId('amount');
    const value = '1e2';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBe('Invalid number');
    });
  });
  it('should not allow hexadecimal', async () => {
    const { queryByText, findByTestId } = renderForm();
    const input: any = await findByTestId('amount');
    const value = '0x1';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBe('Invalid number');
    });
  });
  it('should not allow comma , ', async () => {
    const { queryByText, findByTestId } = renderForm();
    const input: any = await findByTestId('amount');
    const value = '1,2';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBe('Invalid number');
    });
  });
  it('should allow only max number of decimals configured by config', async () => {
    const { queryByText, findByTestId } = renderForm();
    const input: any = await findByTestId('amount');
    const value = '1.1234567890123456789';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.value).toBe(value);
      const req = queryByText(/^Maximum/);
      expect(req!.innerHTML).toBe('Maximum 18 decimals allowed');
    });
  });
  it('should be =< than balance - transaction fee', async () => {
    const { queryByText, findByTestId, getByTestId } = renderForm();
    const input: any = await findByTestId('amount');
    const value = '9999979.9998';

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
      expect(req!.innerHTML).toBe('Insufficient funds');
    });
  });
  it('should show error when not enough balance for non-zero transaction with large gas', async () => {
    const render = renderForm({
      balance: '1_000_000_000_000_000'.replace('_', '') // 0.001
    });

    const receiver: any = await render.findByTestId('receiver');

    fireEvent.change(receiver, { target: { value: testAddress } });

    const amount: any = await render.findByTestId('amount');
    fireEvent.change(amount, { target: { value: '0.00001' } });
    fireEvent.blur(amount, { target: { value: '0.00001' } });

    const gasLimit = render.getByTestId('gasLimit');
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
