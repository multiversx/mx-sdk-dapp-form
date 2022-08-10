import { fireEvent, render } from '@testing-library/react';
import { testAddress, testNetwork } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import { formConfiguration, beforeAll as beginAll } from 'tests/helpers';

const beforAllTokens = () =>
  beginAll({
    formConfigValues: {
      ...formConfiguration,
      gasLimit: '500000',
      tokenId: 'TWO-824e70'
    }
  });

const twoToken = {
  identifier: 'TWO-824e70',
  name: 'TwoTToken',
  ticker: 'Two',
  decimals: 2,
  balance: '100000'
};

const useAmountInput = (methods: ReturnType<typeof render>) => async (
  value: string
) => {
  const input: any = await methods.findByTestId('amount');
  const data = { target: { value } };
  fireEvent.change(input, data);
  fireEvent.blur(input);
  return input;
};

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
  test('Tokens amount', async () => {
    const methods = beforAllTokens();
    const setInput = useAmountInput(methods);

    let input = await setInput('1.1234567890123456789');
    expect(input.value).toBe('1.1234567890123456789');

    input = await setInput('1100');
    const tokenAmountError = await methods.findByTestId('amountError');
    expect(tokenAmountError.textContent).toBe('Insufficient funds');
  });

  test('Tokens amount valid', async () => {
    const methods = beforAllTokens();
    const setInput = useAmountInput(methods);

    const input: any = await setInput('1.123456789012345678');
    expect(input.value).toBe('1.123456789012345678');
    const data: any = await methods.findByTestId('data');

    expect(data.value).toBe(
      'ESDTTransfer@54574f2d383234653730@0f9751ff4d94f34e'
    );

    expect(data.disabled).toBeTruthy(); // check disabled
  });
  test('Tokens amount not zero', async () => {
    const methods = beforAllTokens();
    const setInput = useAmountInput(methods);

    await setInput('0');
    const tokenAmountError = await methods.findByTestId('amountError');
    expect(tokenAmountError.textContent).toBe('Cannot be zero');
  });
});
