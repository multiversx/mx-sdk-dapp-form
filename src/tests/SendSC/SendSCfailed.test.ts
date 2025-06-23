import { act, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { FormDataTestIdsEnum, MAX_GAS_LIMIT } from 'constants/index';
import { ValuesEnum } from 'types/form';
import { fillInForm, setResponse } from './helpers';

describe('SendForm Smart Contract', () => {
  beforeEach(() => {
    setResponse([1500057500, false, 5900]);
  });

  test('Too high gasLimit shows error', async () => {
    const transactionCost = jest.spyOn(axios, 'post');

    const { render } = await fillInForm();

    await waitFor(() => {
      expect(transactionCost).toHaveBeenCalledTimes(1);
    });

    let formatAmountInt = await render.findByTestId(
      FormDataTestIdsEnum.formatAmountInt
    );

    expect(formatAmountInt.innerHTML).toBe('0');

    let formatAmountDecimal = await render.findByTestId(
      FormDataTestIdsEnum.formatAmountDecimals
    );
    expect(formatAmountDecimal.innerHTML).toBe('.0000575575');

    let gasLimit = render.getByTestId(ValuesEnum.gasLimit) as HTMLInputElement;

    await waitFor(() => {
      expect(gasLimit.value).toBe('1,650,063,250');
    });

    const sendBtn = render.getByTestId(FormDataTestIdsEnum.sendBtn);

    act(() => {
      fireEvent.click(sendBtn);
    });

    // first server response fetches a gasLimit value over maxGasLimit
    const req = await render.findByText(/must be lower than/);
    await waitFor(() => {
      expect(req.innerHTML).toBe(
        `Gas limit must be lower than ${MAX_GAS_LIMIT}`
      );
    });
    // modify data field to get a new gasLimit value from the server
    let dataInput = render.getByTestId(ValuesEnum.data) as HTMLInputElement;
    fireEvent.change(dataInput, { target: { value: 'claim@' } });
    fireEvent.blur(dataInput);

    await waitFor(() => {
      expect(transactionCost).toHaveBeenCalledTimes(1);
    });

    // call fails so default value is filled in
    gasLimit = render.getByTestId(ValuesEnum.gasLimit) as HTMLInputElement;

    await waitFor(() => {
      expect(gasLimit.value).toBe('1,650,063,250');
    });

    // 3rd data field change fetches correct server response
    dataInput = render.getByTestId(ValuesEnum.data) as HTMLInputElement;
    fireEvent.change(dataInput, { target: { value: 'claim' } });
    fireEvent.blur(dataInput);

    formatAmountInt = await render.findByTestId(
      FormDataTestIdsEnum.formatAmountInt
    );
    expect(formatAmountInt.innerHTML).toBe('0');

    formatAmountDecimal = await render.findByTestId(
      FormDataTestIdsEnum.formatAmountDecimals
    );
    expect(formatAmountDecimal.innerHTML).toBe('.0000501325');

    expect(transactionCost).toHaveBeenCalledTimes(1);
  });
});
