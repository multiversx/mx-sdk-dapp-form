import { fireEvent, waitFor } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';

describe('EGLD Amount field', () => {
  it('should allow only max number of decimals configured by config', async () => {
    const { queryByText, findByTestId } = renderForm();
    const input: any = await findByTestId(ValuesEnum.amount);
    const value = '1.1234567890123456789';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.value).toBe(value);
      const req = queryByText(/^Maximum/);
      expect(req?.innerHTML).toBe('Maximum 18 decimals allowed');
    });
  });
});
