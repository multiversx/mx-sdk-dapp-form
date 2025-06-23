import { fireEvent, waitFor, act } from '@testing-library/react';
import selectEvent from 'react-select-event';

import { FormDataTestIdsEnum } from 'constants/index';
import { ValuesEnum } from 'types/form';

import {
  beforAllTokens,
  setupEsdtServer,
  useAmountInput,
  useGasLimitInput
} from './helpers';

describe('Send tokens', () => {
  beforeEach(setupEsdtServer);

  test('Tokens gasLimit by amount and reset', async () => {
    const methods = beforAllTokens();
    const setGasLimitInput = useGasLimitInput(methods);
    const setAmountInput = useAmountInput(methods);

    const input = await setGasLimitInput('50000');
    await setAmountInput('10');

    const gasLimitError = await methods.findByTestId(
      FormDataTestIdsEnum.gasLimitError
    );
    expect(gasLimitError.textContent).toBe(
      'Gas limit must be greater or equal to 500000'
    );

    const feeLimit = methods.getByTestId(FormDataTestIdsEnum.feeLimit);
    fireEvent.click(feeLimit);

    const gasLimitResetBtn = await methods.findByTestId('gasLimitResetBtn');
    fireEvent.click(gasLimitResetBtn);

    await act(async () => {
      expect(input.value).toBe('500,000');
    });
  });

  test('Tokens labels and values', async () => {
    const { getByTestId, findByTestId } = beforAllTokens();

    const amountLabel = await findByTestId('amountLabel');
    expect(amountLabel.textContent).toBe('Amount');

    const availableTokens = await findByTestId('available-TWO-824e70');
    expect(availableTokens.getAttribute('data-value')).toBe(
      '1000.00 TWO-824e70'
    );

    const gasLimitInput = getByTestId(ValuesEnum.gasLimit);
    const processedGasLimitInput = gasLimitInput as HTMLInputElement;
    expect(processedGasLimitInput.value).toBe('500,000');
  });

  describe('Tokens amount', () => {
    test('Tokens amount not zero', async () => {
      const methods = beforAllTokens();
      const setInput = useAmountInput(methods);

      await setInput('0');
      const tokenAmountError = await methods.findByTestId(
        FormDataTestIdsEnum.amountError
      );
      expect(tokenAmountError.textContent).toBe('Cannot be zero');
    });

    test('Tokens amount limit', async () => {
      const methods = beforAllTokens();
      const setInput = useAmountInput(methods);

      await setInput('1100');
      const tokenAmountError = await methods.findByTestId(
        FormDataTestIdsEnum.amountError
      );
      expect(tokenAmountError.textContent).toBe('Insufficient funds');
    });
    test('Tokens amount max button', async () => {
      const methods = beforAllTokens();
      const entireTokenBalaceButton = await methods.findByText('Max');
      fireEvent.click(entireTokenBalaceButton);

      const amountInput = await methods.findByTestId(ValuesEnum.amount);
      const processedAmountInput = amountInput as HTMLInputElement;

      expect(processedAmountInput.value).toBe('1,000.00');
      const dataInput = await methods.findByTestId(ValuesEnum.data);
      const processedDataInput = dataInput as HTMLInputElement;

      await waitFor(() => {
        expect(processedDataInput.value).toBe(
          'ESDTTransfer@54574f2d383234653730@0186a0'
        );
      });
    });

    test('Tokens amount no EGLD balance', async () => {
      const methods = beforAllTokens({ balance: '0' });
      const setInput = useAmountInput(methods);

      await setInput('10');
      const sendButton = methods.getByTestId(FormDataTestIdsEnum.sendBtn);
      fireEvent.click(sendButton);

      const gasLimitError = await methods.findByTestId(
        FormDataTestIdsEnum.gasLimitError
      );
      expect(gasLimitError.textContent).toBe('Insufficient funds');
    });
  });

  describe('Tokens gasLimit', () => {
    test('Selecting token after default EGLD fills in data field', async () => {
      const methods = beforAllTokens();
      const setAmountInput = useAmountInput(methods);

      await setAmountInput('10');

      await act(async () => {
        selectEvent.openMenu(methods.getByLabelText('Token'));
      });

      const oneTokenOption = await methods.findByTestId('TWO-824e70-option');
      expect(oneTokenOption.innerHTML).toBeDefined();

      selectEvent.select(methods.getByLabelText('Token'), 'TwoTToken');

      const dataInput = methods.getByTestId(ValuesEnum.data);
      const processedDataInput = dataInput as HTMLInputElement;

      expect(processedDataInput.value).toBe(
        'ESDTTransfer@54574f2d383234653730@03e8'
      );
    });
  });

  describe('Tokens deposit', () => {
    test('When isDeposit is true, hex encoded deposit is added to data field', async () => {
      const methods = beforAllTokens({ isDeposit: true });
      const setAmountInput = useAmountInput(methods);

      await setAmountInput('10');

      await act(async () => {
        selectEvent.openMenu(methods.getByLabelText('Token'));
      });

      selectEvent.select(methods.getByLabelText('Token'), 'TwoTToken');

      const dataInput = methods.getByTestId(ValuesEnum.data);
      const processedDataInput = dataInput as HTMLInputElement;

      expect(processedDataInput.value).toBe(
        'ESDTTransfer@54574f2d383234653730@03e8@6465706f736974'
      );
    });
  });
});
