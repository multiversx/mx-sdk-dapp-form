import { fireEvent, RenderResult, queries } from '@testing-library/react';
import { testAddress, testNetwork } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import { formConfiguration, renderForm as beginAll } from 'tests/helpers';
import { ValuesEnum } from 'types';

export { queries };

export const beforAllTokens = (balance?: string) =>
  beginAll({
    formConfigValues: {
      ...formConfiguration,
      gasLimit: '500000',
      tokenId: 'TWO-824e70'
    },
    ...(balance ? { balance } : {})
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

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

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
