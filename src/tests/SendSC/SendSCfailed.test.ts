import { act, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MAX_GAS_LIMIT } from 'constants/index';
import { fillInForm, finalFee, setResponse } from './helpers';

describe('SendForm Smart Contract', () => {
  beforeEach(() => {
    setResponse([1500057500, false, 92000]);
  });

  test('Too high gasLimit shows error', async () => {
    const transactionCost = jest.spyOn(axios, 'post');

    const { render } = await fillInForm();

    await waitFor(() => {
      expect(transactionCost).toHaveBeenCalledTimes(1);
    });

    let fee = await render.findByTestId('feeLimit');

    await waitFor(() => {
      expect(fee.textContent).toBe('0.0165575575 xEGLD');
    });

    let gasLimit = render.getByTestId('gasLimit') as HTMLInputElement;

    await waitFor(() => {
      expect(gasLimit.value).toBe('1650063250');
    });

    const sendBtn = render.getByTestId('sendBtn');

    act(() => {
      fireEvent.click(sendBtn);
    });

    // first server response fetches a gasLimit value over maxGasLimit
    const req = await render.findByText(/^Must be lower than/);
    await waitFor(() => {
      expect(req.innerHTML).toBe(`Must be lower than ${MAX_GAS_LIMIT}`);
    });
    // modify data field to get a new gasLimit value from the server
    let dataInput = render.getByTestId('data') as HTMLInputElement;
    fireEvent.change(dataInput, { target: { value: 'claim@' } });
    fireEvent.blur(dataInput);

    await waitFor(() => {
      expect(transactionCost).toHaveBeenCalledTimes(2);
    });

    // call fails so default value is filled in
    gasLimit = render.getByTestId('gasLimit') as HTMLInputElement;
    expect(gasLimit.value).toBe('59000');

    // 3rd data field change fetches correct server response
    dataInput = render.getByTestId('data') as HTMLInputElement;
    fireEvent.change(dataInput, { target: { value: 'claim' } });
    fireEvent.blur(dataInput);

    fee = await render.findByTestId('feeLimit');
    await waitFor(() => {
      expect(fee.textContent).toBe(finalFee);
    });

    expect(transactionCost).toHaveBeenCalledTimes(3);
  });
});
