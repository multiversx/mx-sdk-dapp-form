import { RenderResult, fireEvent, waitFor } from '@testing-library/react';
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

const useGasLimitInput = useInput(ValuesEnum.gasLimit);

const beforAllTokens = (balance?: string) =>
  beginAll({
    formConfigValues: {
      ...formConfiguration,
      gasLimit: '500000',
      tokenId: 'TWO-824e70'
    },
    ...(balance ? { balance } : {})
  });

describe('Tokens gasLimit', () => {
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

  test('Tokens gasLimit min and max', async () => {
    const methods = beforAllTokens();
    const setInput = useGasLimitInput(methods);

    const input = await setInput('1');
    expect(input.value).toBe('1');

    let gasLimitError = await methods.findByTestId('gasLimitError');
    expect(gasLimitError.textContent).toBe(
      'Gas limit must be greater or equal to 500000'
    );

    await setInput('5000000000');
    gasLimitError = await methods.findByTestId('gasLimitError');

    await waitFor(() => {
      expect(gasLimitError.textContent).toBe('Must be lower than 600000000');
    });
  });
});
