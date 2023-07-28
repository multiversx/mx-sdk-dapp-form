import { fireEvent, waitFor } from '@testing-library/react';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';

describe('EGLD Amount field', () => {
  it('should be =< than balance - transaction fee', async () => {
    const { queryByText, findByTestId, getByTestId } = renderForm();
    const input: any = await findByTestId(ValuesEnum.amount);
    const value = '9,999,979.9998';

    const fullBalance = { target: { value } };
    fireEvent.change(input, fullBalance);
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input.value).toBe(value);
    });

    const sendButton = getByTestId(FormDataTestIdsEnum.sendBtn);
    fireEvent.click(sendButton);

    await waitFor(() => {
      const req = queryByText('Insufficient funds');
      expect(req?.innerHTML).toBe('Insufficient funds');
    });
  });
});
