import { act, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { testAddress, testReceiver } from '__mocks__';
import { fillInForm, finalFee, setResponse } from './helpers';

const transactionData = {
  chainID: 'T',
  data: 'Y2xhaW0=',
  gasLimit: 57500,
  gasPrice: 1000000000,
  nonce: 0,
  receiver: testReceiver,
  sender: testAddress,
  signature: undefined,
  value: '100000000000000000',
  version: 1
};

describe('SendForm Smart Contract', () => {
  beforeEach(() => {
    setResponse([92000]);
  });

  test('GasLimit gets fetched from server', async () => {
    const transactionCost = jest.spyOn(axios, 'post');
    const { render } = await fillInForm();
    const fee = await render.findByTestId('feeLimit');

    await waitFor(() => {
      expect(fee.textContent).toBe(finalFee);
    });

    expect(transactionCost).toHaveBeenCalledTimes(1);

    expect(transactionCost).toHaveBeenCalledWith(
      '/transaction/cost',
      transactionData,
      { baseURL: 'https://testnet-api.elrond.com', timeout: 4000 }
    );

    const gasLimit = render.getByTestId('gasLimit') as HTMLInputElement;

    expect(gasLimit.value).toBe('101200');

    await act(async () => {
      fireEvent.change(gasLimit, { target: { value: '101201' } });
      fireEvent.blur(gasLimit);
    });

    const sendBtn = render.getByTestId('sendBtn');

    await act(async () => {
      fireEvent.click(sendBtn);
    });

    const confirmFee = render.getByTestId('confirmFee');
    expect(confirmFee.textContent).toContain('0.00005793701');

    // after gasLimit edit, transactionCost does no longer get called
    expect(transactionCost).toHaveBeenCalledTimes(1);
  });
});
