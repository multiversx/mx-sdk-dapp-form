import { act, fireEvent } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { ValuesEnum } from 'types/form';
import { beforAllTokens, setupEsdtServer, useAmountInput } from './helpers';

describe('Send advanced mode', () => {
  beforeEach(setupEsdtServer);

  describe('Advanced mode keeps all values', () => {
    test('Selecting token then pressing Advanced Mode resets form to EGLD', async () => {
      const methods = beforAllTokens();
      const setAmountInput = useAmountInput(methods);

      const advancedMode = methods.queryByTestId(
        FormDataTestIdsEnum.enableAdvancedMode
      );

      expect(advancedMode).toBeNull();

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

      const gasLimitInput = methods.getByTestId(ValuesEnum.gasLimit);
      const processedGasLimitInput = gasLimitInput as HTMLInputElement;
      expect(processedGasLimitInput.value).toBe('500,000');

      const advancedModeBtn: any = methods.queryByTestId(
        FormDataTestIdsEnum.enableAdvancedMode
      );

      fireEvent.click(advancedModeBtn);

      const confirmAdvancedModeBtn = await methods.findByTestId(
        FormDataTestIdsEnum.confirmAdvancedMode
      );

      fireEvent.click(confirmAdvancedModeBtn);

      // reset form
      expect(processedDataInput.value).toBe(
        'ESDTTransfer@54574f2d383234653730@03e8'
      );

      expect(processedGasLimitInput.value).toBe('500,000');
      expect(dataInput).toBeEnabled();
    });
  });
});
