import { RenderResult, fireEvent, queries } from '@testing-library/react';
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
  const render = renderForm({
    balance: '7600000000000000000000'
  });

  const amount: any = await render.findByTestId(ValuesEnum.amount);
  fireEvent.change(amount, { target: { value: '0.1' } });
  fireEvent.blur(amount);

  expect(amount.value).toBe('0.1');

  const receiver: any = render.getByTestId(ValuesEnum.receiver);
  fireEvent.change(receiver, {
    target: {
      value: testReceiver
    }
  });
  fireEvent.blur(receiver);

  const dataInput: any = render.getByTestId(ValuesEnum.data);

  fireEvent.change(dataInput, { target: { value: 'claim' } });
  fireEvent.blur(dataInput);

  const fee = await render.findByTestId(FormDataTestIdsEnum.feeLimit);
  expect(fee.textContent).toBe('0.0000575 xEGLD');

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
