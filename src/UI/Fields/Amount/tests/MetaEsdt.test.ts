// import { fireEvent, render } from '@testing-library/react';
import { testAddress, testNetwork } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import { formConfiguration, beforeAll as beginAll } from 'tests/helpers';
// import { ValuesEnum } from 'types';

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

// const useInput = (field: ValuesEnum) => (
//   methods: ReturnType<typeof render>
// ) => async (value: string) => {
//   const input: any = await methods.findByTestId(field);
//   const data = { target: { value } };
//   fireEvent.change(input, data);
//   fireEvent.blur(input);
//   return input;
// };

// const useAmountInput = useInput(ValuesEnum.amount);
// const useGasLimitInput = useInput(ValuesEnum.gasLimit);

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
  test('Tokens labels and values', async () => {
    const { getByTestId, findByTestId } = beforAllTokens();

    // TODO: bring back
    // const amountLabel = await findByTestId('amountLabel');
    // expect(amountLabel.textContent).toBe('Amount');

    const availableTokens = await findByTestId('availableTWO-824e70');
    expect(availableTokens.getAttribute('data-value')).toBe('1000 TWO-824e70');

    const gasLimit: any = getByTestId('gasLimit');
    expect(gasLimit.value).toBe('500000');
  });
});
