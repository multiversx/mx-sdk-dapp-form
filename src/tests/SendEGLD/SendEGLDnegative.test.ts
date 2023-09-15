import { fireEvent } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';

describe('EGLD Amount field', () => {
  it.only('should be =< than balance - transaction fee', async () => {
    const { findByTestId } = renderForm();
    const input: any = await findByTestId(ValuesEnum.amount);
    const value = '-1';

    const fullBalance = { target: { value } };
    fireEvent.change(input, fullBalance);
    fireEvent.blur(input);
    expect(input.value).toBe('1');
  });
});
