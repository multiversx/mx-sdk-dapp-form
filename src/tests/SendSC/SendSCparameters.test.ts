import axios from 'axios';
import { testAddress, testReceiver } from '__mocks__';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { ValuesEnum } from 'types/form';
import { fillInForm, setResponse } from './helpers';
import { sleep } from 'tests/helpers';
import userEvent from '@testing-library/user-event';

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

    let formatAmountInt = await render.findByTestId(
      FormDataTestIdsEnum.formatAmountInt
    );

    expect(formatAmountInt.innerHTML).toBe('0');

    let formatAmountDecimal = await render.findByTestId(
      FormDataTestIdsEnum.formatAmountDecimals
    );

    expect(formatAmountDecimal.innerHTML).toBe('.0000579');
    expect(transactionCost).toHaveBeenCalledTimes(2);

    expect(transactionCost).toHaveBeenCalledWith(
      '/transaction/cost',
      transactionData,
      { baseURL: 'https://testnet-api.multiversx.com', timeout: 4000 }
    );

    const gasLimit = render.getByTestId(
      ValuesEnum.gasLimit
    ) as HTMLInputElement;

    expect(gasLimit.value).toBe('101,200');

    await userEvent.clear(gasLimit);
    await userEvent.type(gasLimit, '101201');
    await userEvent.tab();

    await sleep(1000);
    const sendBtn = render.getByTestId(FormDataTestIdsEnum.sendBtn);
    await userEvent.click(sendBtn);
    await sleep(1000);

    const sendTrxBtn = render.getByTestId(FormDataTestIdsEnum.sendTrxBtn);
    await userEvent.click(sendTrxBtn);
    await sleep(1000);

    const confirmFee = await render.findByTestId(
      FormDataTestIdsEnum.confirmFee
    );

    expect(confirmFee.textContent).toContain('0.00005051201 xEGLD');

    // after gasLimit edit, transactionCost does no longer get called
    expect(transactionCost).toHaveBeenCalledTimes(2);
  });
});
