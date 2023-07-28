import { fireEvent, waitFor } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';

describe('EGLD Amount field', () => {
  it.only('should be =< than balance - transaction fee', async () => {
    const { queryByText, findByTestId } = renderForm();
    const input: any = await findByTestId(ValuesEnum.amount);
    const value = '-1';

    const fullBalance = { target: { value } };
    fireEvent.change(input, fullBalance);
    fireEvent.blur(input);
    expect(input.value).toBe(value);

    await waitFor(() => {
      expect(input.value).toBe(value);

      const req = queryByText('Invalid number');
      expect(req?.innerHTML).toBe('Invalid number');
    });
  });
});
