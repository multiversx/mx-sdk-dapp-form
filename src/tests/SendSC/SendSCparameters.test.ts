import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { testAddress, testReceiver } from '__mocks__';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { sleep } from 'tests/helpers';
import { ValuesEnum } from 'types/form';
import { fillInForm, setResponse } from './helpers';

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

    const formatAmountInt = await render.findByTestId(
      FormDataTestIdsEnum.formatAmountInt
    );

    expect(formatAmountInt.innerHTML).toBe('0');

    const formatAmountDecimal = await render.findByTestId(
      FormDataTestIdsEnum.formatAmountDecimals
    );

    await waitFor(() => {
      expect(formatAmountDecimal.innerHTML).toBe('.000057937');
    });
    expect(transactionCost).toHaveBeenCalled();

    expect(transactionCost).toHaveBeenCalledWith(
      '/transaction/cost',
      transactionData,
      { baseURL: 'https://testnet-api.multiversx.com', timeout: 4000 }
    );

    const gasLimit = render.getByTestId(
      ValuesEnum.gasLimit
    ) as HTMLInputElement;

    expect(gasLimit.value).toBe('101,200');

    // How many requests it took to settle depends on how the debounce windows line up, so
    // the check below is that editing gasLimit adds none — not an absolute count.
    const callsBeforeGasLimitEdit = transactionCost.mock.calls.length;

    await userEvent.clear(gasLimit);
    await userEvent.type(gasLimit, '101201');
    await userEvent.tab();

    await sleep();
    const sendBtn = render.getByTestId(FormDataTestIdsEnum.sendBtn);
    await userEvent.click(sendBtn);
    await sleep();

    const confirmFee = await render.findByTestId(
      FormDataTestIdsEnum.confirmFee
    );

    expect(confirmFee.textContent).toContain('0.00005051201 xEGLD');

    // after gasLimit edit, transactionCost does no longer get called
    expect(transactionCost).toHaveBeenCalledTimes(callsBeforeGasLimitEdit);
  });
});
