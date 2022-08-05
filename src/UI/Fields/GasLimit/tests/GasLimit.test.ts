import { fireEvent, waitFor } from '@testing-library/react';
import { beforeAll } from 'tests/helpers/beforeAll';

describe('GasLimit field', () => {
  it('should not be empty', async () => {
    const { findByLabelText } = beforeAll();
    const input: any = await findByLabelText('Gas Limit');
    await waitFor(() => {
      expect(input.value).toBe('50000');
    });
  });
  it('should not be string', async () => {
    const { findByLabelText, queryByText } = beforeAll();
    const input: any = await findByLabelText('Gas Limit');
    const value = 'string';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBe('Invalid number');
    });
  });
  // it('should be integer', async () => {
  //   const { getByLabelText, queryByText } = beforeAll();
  //   const input: any = getByLabelText('Gas Limit');
  //   const value = '0.1';
  //   const data = { target: { value } };
  //   fireEvent.change(input, data);
  //   fireEvent.blur(input);
  //   await waitFor(() => {
  //     const req = queryByText('Invalid number');
  //     expect(req!.innerHTML).toBe('Invalid number');
  //   });
  // });
  // it('should not allow exponential gasLimit', async () => {
  //   const { getByLabelText, queryByText } = beforeAll();
  //   const input: any = getByLabelText('Gas Limit');
  //   const value = '1e20';
  //   const data = { target: { value } };
  //   fireEvent.change(input, data);
  //   fireEvent.blur(input);
  //   await waitFor(() => {
  //     const req = queryByText('Invalid number');
  //     expect(req!.innerHTML).toBe('Invalid number');
  //   });
  // });
  // it('should not allow negative gasLimit', async () => {
  //   const { getByLabelText, queryByText } = beforeAll();
  //   const input: any = getByLabelText('Gas Limit');
  //   const value = '-1';
  //   const data = { target: { value } };
  //   fireEvent.change(input, data);
  //   fireEvent.blur(input);
  //   await waitFor(() => {
  //     const req = queryByText('Invalid number');
  //     expect(req!.innerHTML).toBeDefined();
  //   });
  // });
  // it('should not allow explicit positive gasLimit', async () => {
  //   const { getByLabelText, queryByText } = beforeAll();
  //   const input: any = getByLabelText('Gas Limit');
  //   const value = '+1';
  //   const data = { target: { value } };
  //   fireEvent.change(input, data);
  //   fireEvent.blur(input);
  //   await waitFor(() => {
  //     const req = queryByText('Invalid number');
  //     expect(req!.innerHTML).toBeDefined();
  //   });
  // });
  // it('should >= than the one set by config', async () => {
  //   const { getByLabelText, queryByText } = beforeAll();
  //   const input: any = getByLabelText('Gas Limit');
  //   const value = parseInt(configGasLimit) - 1;
  //   const data = { target: { value } };
  //   fireEvent.change(input, data);
  //   fireEvent.blur(input);

  //   await waitFor(() => {
  //     const req = queryByText(/^Gas limit must be greater/);
  //     expect(req!.innerHTML).toBe(
  //       `Gas limit must be greater or equal to ${configGasLimit}`
  //     );
  //   });
  // });
  // it('should >= than the configGasLimit + data.length if data is set', async () => {
  //   const methods = beforeAll();

  //   const dataInput: any = methods.getByLabelText('Data');
  //   const dataValue = 'four';
  //   fireEvent.change(dataInput, { target: { value: dataValue } });
  //   fireEvent.blur(dataInput);

  //   const input: any = methods.getByLabelText('Gas Limit');
  //   const value = configGasLimit;
  //   const data = { target: { value } };
  //   fireEvent.change(input, data);
  //   fireEvent.blur(input);

  //   await waitFor(() => {
  //     const req = methods.queryByText(/^Gas limit must be greater/);
  //     expect(req!.innerHTML).toBe(
  //       'Gas limit must be greater or equal to 56000'
  //     );
  //   });
  // });
  // it('setting Gas limit + amount > balance should trigger error', async () => {
  //   const { getByLabelText, getByTestId, queryByText } = beforeAll();
  //   const input: any = getByTestId('amount');
  //   const value = '0.8123';
  //   const data = { target: { value } };
  //   fireEvent.change(input, data);

  //   const gasInput: any = getByLabelText('Gas Limit');
  //   const gasValue = 50001; // add 1 to the end
  //   fireEvent.change(gasInput, { target: { value: gasValue } });

  //   const sendButton = getByTestId('sendBtn');
  //   fireEvent.click(sendButton);
  //   await waitFor(() => {
  //     const req = queryByText('Insufficient funds');
  //     expect(req!.innerHTML).toBe('Insufficient funds');
  //   });
  // });
  // it('should not show error when writing in data', async () => {
  //   const {
  //     getByLabelText,
  //     queryByText,
  //     getByText,
  //     findByTestId
  //   } = beforeAll();

  //   const address: any = getByLabelText('To');
  //   fireEvent.change(address, { target: { value: publicKey } });
  //   fireEvent.blur(address);

  //   const entireBalaceButton = getByText('Max');
  //   fireEvent.click(entireBalaceButton);

  //   const feeLimit = await findByTestId('feeLimit');
  //   fireEvent.click(feeLimit);

  //   const gasLimit: any = getByLabelText('Gas Limit');
  //   fireEvent.blur(gasLimit);

  //   const data = getByLabelText('Data');
  //   fireEvent.change(data, { target: { value: '123' } });
  //   fireEvent.keyUp(data);

  //   await waitFor(() => {
  //     const req = queryByText(/^Gas limit must be greater/);
  //     expect(req).toBe(null);
  //   });
  // });
  // it('should show error when not enough balance for zero transaction with large gas', async () => {
  //   const render = beforeAll({
  //     balance: '1_000_000_000_000_000'.replace('_', '') // 0.001
  //   });

  //   const destinationAddress: any = await render.findByTestId(
  //     'destinationAddress'
  //   );
  //   const value =
  //     'erd15s35epmf7pvq822yrcgr20utj8lsn7fvgqnrl3ls9gtazu7leeyqr5kkaf';
  //   fireEvent.change(destinationAddress, { target: { value } });

  //   const amount = render.getByTestId('amount');
  //   fireEvent.change(amount, { target: { value: '0' } });

  //   const gasLimit = render.getByTestId('gasLimit');
  //   fireEvent.change(gasLimit, { target: { value: '600000000' } });

  //   const sendButton = render.getByTestId('sendBtn');
  //   fireEvent.click(sendButton);
  //   await waitFor(() => {
  //     const gasLimitError = render.getByTestId('gasLimitError');
  //     expect(gasLimitError.innerHTML).toBe('Insufficient funds');
  //     const amountError = render.queryByTestId('amountError');
  //     expect(amountError).toBeNull();
  //   });
  // });
});
