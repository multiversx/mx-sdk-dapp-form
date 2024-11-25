import { GAS_LIMIT } from '@multiversx/sdk-dapp/constants/index';
import { fireEvent, waitFor } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types';

describe('GasLimit field', () => {
  it('should >= than the configGasLimit + data.length if data is set', async () => {
    const { findByTestId, getByLabelText, queryByText } = renderForm();

    const dataInput = await findByTestId(ValuesEnum.data);
    const dataValue = 'four';

    fireEvent.change(dataInput, { target: { value: dataValue } });
    fireEvent.blur(dataInput);

    const input = getByLabelText('Gas Limit');
    const value = GAS_LIMIT;
    const data = { target: { value } };

    fireEvent.change(input, data);
    fireEvent.blur(input);

    await waitFor(() => {
      const req = queryByText(/^Gas limit must be greater/);
      expect(req?.innerHTML).toBe(
        'Gas limit must be greater or equal to 56000'
      );
    });
  });
});
