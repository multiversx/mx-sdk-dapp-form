import { fireEvent, render, waitFor } from '@testing-library/react';
import { testAddress, testNetwork } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import { formConfiguration, beforeAll as beginAll } from 'tests/helpers';
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

const useInput = (field: ValuesEnum) => (
  methods: ReturnType<typeof render>
) => async (value: string) => {
  const input: any = await methods.findByTestId(field);
  const data = { target: { value } };
  fireEvent.change(input, data);
  fireEvent.blur(input);
  return input;
};

const useAmountInput = useInput(ValuesEnum.amount);
const useGasLimitInput = useInput(ValuesEnum.gasLimit);

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
    test('Tokens amount limit', async () => {
      const methods = beforAllTokens();
      const setInput = useAmountInput(methods);

      await setInput('1100');
      const tokenAmountError = await methods.findByTestId('amountError');
      expect(tokenAmountError.textContent).toBe('Insufficient funds');
    });
    test('Tokens amount max button', async () => {
      const methods = beforAllTokens();
      const entireTokenBalaceButton = await methods.findByText('Max');
      fireEvent.click(entireTokenBalaceButton);

      const input: any = await methods.findByTestId('amount');

      expect(input.value).toBe('1000');

      const data: any = await methods.findByTestId('data');

      await waitFor(() => {
        expect(data.value).toBe('ESDTTransfer@54574f2d383234653730@0186a0');
      });
    });

    test('Tokens amount no EGLD balance', async () => {
      const methods = beforAllTokens('0');
      const setInput = useAmountInput(methods);

      await setInput('10');

      const sendButton = methods.getByTestId('sendBtn');
      fireEvent.click(sendButton);

      const gasLimitError = await methods.findByTestId('gasLimitError');
      expect(gasLimitError.textContent).toBe('Insufficient funds');
    });
  });

  describe('Tokens gasLimit', () => {
    test.only('Tokens gasLimit min and max', async () => {
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
});
