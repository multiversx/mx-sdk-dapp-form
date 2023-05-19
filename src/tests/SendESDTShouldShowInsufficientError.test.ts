import { fireEvent, RenderResult } from '@testing-library/react';
import { testAddress, testNetwork } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import { formConfiguration, renderForm as beginAll } from 'tests/helpers';
import { ValuesEnum } from 'types';

const beforAllTokens = (balance?: string) =>
  beginAll({
    formConfigValues: {
      ...formConfiguration,
      gasLimit: '500000',
      tokenId: 'TWO-824e70'
    },
    ...(balance ? { balance } : {})
  });

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

describe('Send tokens', () => {
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

  describe('Tokens amount', () => {
    test('Tokens amount', async () => {
      const methods = beforAllTokens();
      const setInput = useAmountInput(methods);

      let input = await setInput('1.1234567890123456789');
      expect(input.value).toBe('1.1234567890123456789');

      input = await setInput('1100');
      const tokenAmountError = await methods.findByTestId('amountError');
      expect(tokenAmountError.textContent).toBe('Insufficient funds');
    });
  });
});
