import { fireEvent, waitFor } from '@testing-library/react';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { formattedAmountSelector } from 'tests/helpers';
import { renderForm } from 'tests/helpers';
import { ValuesEnum } from 'types/form';

describe('Data field tests', () => {
  test('data changes transaction fee', async () => {
    const { findByTestId, getByTestId } = renderForm();

    const feeLimit = await findByTestId(FormDataTestIdsEnum.feeLimit);
    expect(formattedAmountSelector(feeLimit).intAmount).toBe('0');

    const data = { target: { value: 'four' } };
    const input = getByTestId(ValuesEnum.data);

    fireEvent.change(input, data);

    const gasInput = getByTestId(ValuesEnum.gasLimit);
    const processedGasLimitInput = gasInput as HTMLInputElement;
    expect(processedGasLimitInput.value).toBe('56,000');

    expect(formattedAmountSelector(feeLimit).intAmount).toBe('0');
    expect(formattedAmountSelector(feeLimit).decimalAmount).toBe('.000056');

    // prevent async effects error logging
    const feeInFiat = await findByTestId('feeInFiat');
    await waitFor(() => {
      expect(feeInFiat.textContent).toBe('(≈ $0.0033)');
    });
  });
});
