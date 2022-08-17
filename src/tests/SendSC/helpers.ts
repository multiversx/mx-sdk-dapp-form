// import { act, fireEvent } from '@testing-library/react';
import { testNetwork } from '__mocks__';
import { server, rest } from '__mocks__/server';
import { renderForm } from '../helpers';

function* generator(arr: any[]) {
  yield* arr;
}

export const finalFee = '0.000057937\u00a0xEGLD';

export const fillInForm = async () => {
  const render = renderForm({
    balance: '7600000000000000000000'
  });

  // const amount: any = await render.findByTestId('amount');
  // act(() => {
  //   fireEvent.change(amount, { target: { value: '0.1' } });
  //   fireEvent.blur(amount);
  // });

  // expect(amount.value).toBe('0.1');

  // const destinationAddress: any = render.getByTestId('destinationAddress');
  // act(() => {
  //   fireEvent.change(destinationAddress, {
  //     target: {
  //       value: testReceiver
  //     }
  //   });
  //   fireEvent.blur(destinationAddress);
  // });

  // const dataInput: any = render.getByTestId('data');

  // act(() => {
  //   fireEvent.change(dataInput, { target: { value: 'claim' } });
  //   fireEvent.blur(dataInput);
  // });

  // const fee = await render.findByTestId('feeLimit');
  // await waitFor(() => {
  //   expect(fee.textContent).toBe('0.0000575\u00a0xEGLD');
  // });

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
