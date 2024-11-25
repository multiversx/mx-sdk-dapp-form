import { fireEvent, waitFor } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types';

describe('GasPrice field', () => {
  it('should be below given threshold', async () => {
    const { findByLabelText, findByTestId } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '0.0000001' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    await waitFor(async () => {
      const errorMessage = await findByTestId(`${ValuesEnum.gasPrice}Error`);
      expect(errorMessage?.textContent).toBe(
        'Gas price must be lower or equal to 0.00000001'
      );
    });
  });
});
