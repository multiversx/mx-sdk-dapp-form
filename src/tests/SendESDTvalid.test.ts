import { RenderResult, act, fireEvent } from '@testing-library/react';
import { testAddress, testNetwork } from '__mocks__';
import { mockResponse, rest, server } from '__mocks__/server';
import { formConfiguration, renderForm as beginAll } from 'tests/helpers';
import { ValuesEnum } from 'types';

const twoToken = {
  identifier: 'TWO-824e70',
  name: 'TwoTToken',
  ticker: 'Two',
  decimals: 2,
  balance: '100000'
};

const useInput =
  (field: ValuesEnum) => (methods: RenderResult) => async (value: string) => {
    const input: any = await methods.findByTestId(field);
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    return input;
  };

const useAmountInput = useInput(ValuesEnum.amount);

const beforAllTokens = (balance?: string) =>
  beginAll({
    formConfigValues: {
      ...formConfiguration,
      gasLimit: '500000',
      tokenId: 'TWO-824e70'
    },
    ...(balance ? { balance } : {})
  });

describe('Tokens amount', () => {
  beforeEach(() => {
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
  });

  test('Tokens amount valid', async () => {
    const methods = beforAllTokens();
    const setInput = useAmountInput(methods);

    const input: any = await setInput('1.12');
    expect(input.value).toBe('1.12');
    const data: any = await methods.findByTestId('data');

    await act(async () => {
      expect(data.value).toBe('ESDTTransfer@54574f2d383234653730@70');
      expect(data.disabled).toBeTruthy(); // check disabled
    });
  });
});
