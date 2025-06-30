import { GAS_LIMIT } from '@multiversx/sdk-dapp/out/constants';
import { waitFor } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

describe('GasLimit field', () => {
  it('should >= than the configGasLimit + data.length if data is set', async () => {
    const { findByTestId, getByLabelText, queryByText } = renderForm();

    const dataInput = await findByTestId(ValuesEnum.data);
    const dataValue = 'four';

    await userEvent.clear(dataInput);
    await userEvent.type(dataInput, dataValue);
    await userEvent.tab();
    await sleep();

    const input = getByLabelText('Gas Limit');
    const value = GAS_LIMIT;
    const data = { target: { value } };

    await userEvent.clear(input);
    await userEvent.type(input, data.target.value.toString());
    await userEvent.tab();
    await sleep();

    await waitFor(() => {
      const req = queryByText(/^Gas limit must be greater/);
      expect(req?.innerHTML).toBe(
        'Gas limit must be greater or equal to 56000'
      );
    });
  });
});
