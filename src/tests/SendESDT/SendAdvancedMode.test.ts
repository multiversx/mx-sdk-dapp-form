import { act } from '@testing-library/react';
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

      await setAmountInput('10');

      expect(
        methods.queryByTestId(FormDataTestIdsEnum.enableAdvancedMode)
      ).toBeInTheDocument();

      await act(async () => {
        selectEvent.openMenu(methods.getByLabelText('Token'));
      });

      const oneTokenOption = await methods.findByTestId('TWO-824e70-option');
      expect(oneTokenOption.innerHTML).toBeDefined();

      selectEvent.select(methods.getByLabelText('Token'), 'TwoTToken');

      const dataInput: any = methods.getByTestId(ValuesEnum.data);
      expect(dataInput.value).toBe('ESDTTransfer@54574f2d383234653730@03e8');
    });
  });
});
