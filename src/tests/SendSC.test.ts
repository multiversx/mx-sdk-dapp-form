import {
  act,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import axios from 'axios';
import { testAddress, testNetwork, testReceiver } from '__mocks__';
import { server, rest } from '__mocks__/server';
// import { maxGasLimit } from 'constants/index';
import { beforeAll } from './helpers';

// file.only

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

export function* generator(arr: any[]) {
  yield* arr;
}

const fillInForm = async () => {
  const render = beforeAll({
    balance: '7600000000000000000000'
  });

  const amount: any = await render.findByTestId('amount');
  act(() => {
    fireEvent.change(amount, { target: { value: '0.1' } });
    fireEvent.blur(amount);
  });

  expect(amount.value).toBe('0.1');

  const destinationAddress: any = render.getByTestId('destinationAddress');
  act(() => {
    fireEvent.change(destinationAddress, {
      target: {
        value: testReceiver
      }
    });
    fireEvent.blur(destinationAddress);
  });

  const dataInput: any = render.getByTestId('data');

  act(() => {
    fireEvent.change(dataInput, { target: { value: 'claim' } });
    fireEvent.blur(dataInput);
  });

  const fee = await render.findByTestId('feeLimit');
  await waitFor(() => {
    expect(fee.textContent).toBe('0.0000575\u00a0xEGLD');
  });

  return { render };
};

const finalFee = '0.000057937\u00a0xEGLD';

describe('SendForm Smart Contract', () => {
  beforeEach(() => {
    const gasLimitValues = generator([92000]);
    server.use(
      rest.post(
        `${testNetwork.apiAddress}/transaction/cost`,
        (_req, res, ctx) => {
          const { value: txGasUnits } = gasLimitValues.next();

          return res(
            ctx.status(200),
            ctx.json({ data: { txGasUnits }, code: 'successful' })
          );
        }
      )
    );
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

    const spinner = await render.findByTestId('scamAddressLoadingSpinner');

    await waitForElementToBeRemoved(() => spinner);

    const sendBtn = render.getByTestId('sendBtn');

    await act(async () => {
      fireEvent.click(sendBtn);
    });

    const confirmFee = render.getByTestId('confirmFee');
    expect(confirmFee.textContent).toContain('0.00005793701');

    // after gasLimit edit, transactionCost does no longer get called
    expect(transactionCost).toHaveBeenCalledTimes(1);
  });
  //   test('Too high gasLimit shows error', async () => {
  //     const txGasUnitsValues = generator([1500057500, false, 92000]);
  //     const { render, transactionCost } = await fillInForm(txGasUnitsValues);

  //     let fee = await render.findByTestId('feeLimit');

  //     await waitFor(() => {
  //       expect(fee.textContent).toBe('0 EGLD');
  //     });

  //     let gasLimit = render.getByTestId('gasLimit') as HTMLInputElement;
  //     expect(gasLimit.value).toBe('1650063250');

  //     const sendBtn = render.getByTestId('sendBtn');
  //     fireEvent.click(sendBtn);

  //     // first server response fetches a gasLimit value over maxGasLimit
  //     const req = await render.findByText(/^Must be lower than/);
  //     expect(req.innerHTML).toBe(`Must be lower than ${maxGasLimit}`);

  //     // modify data field to get a new gasLimit value from the server
  //     let dataInput = render.getByTestId('data') as HTMLInputElement;
  //     fireEvent.change(dataInput, { target: { value: 'claim@' } });
  //     fireEvent.blur(dataInput);

  //     await waitFor(() => {
  //       expect(transactionCost).toHaveBeenCalledTimes(2);
  //     });

  //     // call fails so default value is filled in
  //     gasLimit = render.getByTestId('gasLimit') as HTMLInputElement;
  //     await waitFor(() => {
  //       expect(gasLimit.value).toBe('59000');
  //     });

  //     // 3rd data field change fetches correct server response
  //     dataInput = render.getByTestId('data') as HTMLInputElement;
  //     fireEvent.change(dataInput, { target: { value: 'claim' } });
  //     fireEvent.blur(dataInput);

  //     await waitFor(() => {
  //       expect(transactionCost).toHaveBeenCalledTimes(3);
  //     });

  //     fee = await render.findByTestId('feeLimit');
  //     await waitFor(() => {
  //       expect(fee.textContent).toBe(finalFee);
  //     });
  //   });
});
