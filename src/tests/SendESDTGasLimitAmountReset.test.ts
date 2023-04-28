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

const useGasLimitInput = useInput(ValuesEnum.gasLimit);
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

  test('Tokens gasLimit by amount and reset', async () => {
    const methods = beforAllTokens();
    const setGasLimitInput = useGasLimitInput(methods);
    const setAmountInput = useAmountInput(methods);

    const input = await setGasLimitInput('50000');
    await setAmountInput('10');

    const gasLimitError = await methods.findByTestId('gasLimitError');
    expect(gasLimitError.textContent).toBe(
      'Gas limit must be greater or equal to 500000'
    );

    const feeLimit = methods.getByTestId('feeLimit');
    fireEvent.click(feeLimit);

    const gasLimitResetBtn = await methods.findByTestId('gasLimitResetBtn');
    fireEvent.click(gasLimitResetBtn);

    await act(async () => {
      expect(input.value).toBe('500000');
    });
  });
});
