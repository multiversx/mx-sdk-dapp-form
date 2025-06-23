import {
  RenderResult,
  fireEvent,
  queries,
  screen,
  act,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { testNetwork, testReceiver } from '__mocks__';
import { server, rest } from '__mocks__/server';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { ValuesEnum } from 'types/form';

import { renderForm } from '../helpers';

function* generator(arr: any[]) {
  yield* arr;
}

export const finalFee = '0.000057937 xEGLD';

export const fillInForm: () => Promise<{
  render: RenderResult<typeof queries, HTMLElement, HTMLElement>;
}> = async () => {
  const render = renderForm({ balance: '7600000000000000000000' });

  // Wait for loader to disappear (form is ready)
  await render.findByTestId('amount');

  // Wait for the input to be enabled and have the expected initial value
  const amountInput = await render.findByTestId(ValuesEnum.amount);
  const processedAmountInput = amountInput as HTMLInputElement;
  await waitFor(() => {
    expect(processedAmountInput.disabled).toBeFalsy();
    expect(processedAmountInput.value).toBe('');
  });

  await act(async () => {
    await userEvent.type(processedAmountInput, '0.1');
    fireEvent.blur(processedAmountInput);
  });

  await waitFor(() => {
    expect(processedAmountInput.value).toBe('0.1');
  });

  // Debug output
  screen.debug();

  const receiver = render.getByTestId(ValuesEnum.receiver);
  const processedReceiverInput = receiver as HTMLInputElement;
  fireEvent.change(processedReceiverInput, { target: { value: testReceiver } });
  fireEvent.blur(processedReceiverInput);
  expect(processedReceiverInput.value).toBe(testReceiver);

  const dataInput = render.getByTestId(ValuesEnum.data);
  const processedDataInput = dataInput as HTMLInputElement;
  fireEvent.change(processedDataInput, { target: { value: 'claim' } });
  fireEvent.blur(processedDataInput);
  expect(processedDataInput.value).toBe('claim');

  const formatAmountInt = await render.findByTestId(
    FormDataTestIdsEnum.formatAmountInt
  );
  expect(formatAmountInt.innerHTML).toBe('0');

  const formatAmountDecimal = await render.findByTestId(
    FormDataTestIdsEnum.formatAmountDecimals
  );
  expect(formatAmountDecimal.innerHTML).toBe('.0000500');

  return { render };
};

export const setResponse = (values: (number | boolean)[]) => {
  const gasLimitValues = generator(values);
  server.use(
    rest.post(
      `${testNetwork.apiAddress}/transaction/cost`,
      (_req, res, ctx) => {
        const { value: txGasUnits } = gasLimitValues.next();

        return res(
          ctx.status(200),
          ctx.json({
            data: { txGasUnits: txGasUnits || 0 },
            code: txGasUnits ? 'successful' : 'failed'
          })
        );
      }
    )
  );
};
