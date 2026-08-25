import { fireEvent } from '@testing-library/react';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { selectToken } from 'tests/helpers';
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

      const oneTokenOption = await selectToken(methods, 'TWO-824e70');
      expect(oneTokenOption.innerHTML).toBeDefined();

      // selecting a token resets the amount, so it is filled in afterwards
      await setAmountInput('10');

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
      expect((dataInput as HTMLInputElement).disabled).toBe(false);
    });
  });
});
