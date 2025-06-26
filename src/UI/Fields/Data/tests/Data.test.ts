import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { renderForm } from 'tests/helpers';
import { ValuesEnum } from 'types/form';

describe('Data field tests', () => {
  test('data changes transaction fee', async () => {
    const { findByTestId } = renderForm();

    const formatAmountInt = await findByTestId(
      FormDataTestIdsEnum.formatAmountInt
    );
    expect(formatAmountInt.innerHTML).toBe('0');

    const data = { target: { value: 'four' } };
    const input = await findByTestId(ValuesEnum.data);

    userEvent.type(input, data.target.value);

    const formatAmountDecimal = await findByTestId(
      FormDataTestIdsEnum.formatAmountDecimals
    );

    const gasInput = await findByTestId(ValuesEnum.gasLimit);
    const processedGasLimitInput = gasInput as HTMLInputElement;
    expect(processedGasLimitInput.value).toBe('56,000');

    expect(formatAmountInt.innerHTML).toBe('0');
    expect(formatAmountDecimal.innerHTML).toBe('.000056');

    // prevent async effects error logging
    const feeInFiat = await findByTestId('feeInFiat');
    await waitFor(() => {
      expect(feeInFiat.textContent).toBe('(≈ $0.0033)');
    });
  });
});
