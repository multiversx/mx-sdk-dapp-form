import { RenderResult, queries } from '@testing-library/react';
import { testAddress, testNetwork } from '__mocks__/accountConfig';
import { rest, server, mockResponse } from '__mocks__/server';
import { formConfiguration, renderForm as beginAll } from 'tests/helpers';
import { ValuesEnum } from 'types';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';
export { queries };

export const beforAllTokens = (props?: {
  balance?: string;
  isDeposit?: boolean;
}) =>
  beginAll({
    formConfigValues: {
      ...formConfiguration,
      gasLimit: '500000',
      tokenId: 'TWO-824e70'
    },
    ...(props?.balance ? { balance: props.balance } : {}),
    ...(props?.isDeposit ? { isDeposit: props.isDeposit } : {})
  });

export const twoToken = {
  identifier: 'TWO-824e70',
  name: 'TwoTToken',
  ticker: 'Two',
  decimals: 2,
  balance: '100000'
};

const useInput =
  (field: ValuesEnum) => (methods: RenderResult) => async (value: string) => {
    const input = await methods.findByTestId(field);
    const processedInput = input as HTMLInputElement;
    const data = { target: { value } };

    await userEvent.clear(processedInput);
    await userEvent.type(processedInput, data.target.value);
    await userEvent.tab();
    await sleep();

    return processedInput;
  };

export const useAmountInput = useInput(ValuesEnum.amount);
export const useGasLimitInput = useInput(ValuesEnum.gasLimit);

export const setupEsdtServer = () => {
  server.use(
    rest.get(
      `${testNetwork.apiAddress}/accounts/${testAddress}/tokens/${twoToken.identifier}`,
      mockResponse(twoToken)
    )
  );
  server.use(
    rest.get(
      `${testNetwork.apiAddress}/accounts/${testAddress}/tokens`,
      mockResponse([twoToken])
    )
  );
};
