import { renderForm, sleep } from 'tests/helpers';
import { ValuesEnum } from 'types/form';
import userEvent from '@testing-library/user-event';

describe('Data ledger field tests', () => {
  test('data field over 300 character error for ledger app version 1.0.10', async () => {
    const data = {
      target: {
        value: new Array(300 + 2).join('0') // creates a 302 characters long string
      }
    };

    const methods = renderForm({
      ledger: {
        ledgerDataActive: true,
        version: '1.0.8'
      }
    });

    const input = await methods.findByTestId(ValuesEnum.data);
    await userEvent.clear(input);
    await userEvent.type(input, data.target.value);
    await userEvent.tab();
    await sleep();

    const dataError = await methods.findByTestId('dataError');
    expect(dataError.textContent).toBe(
      'Data too long. You need at least MultiversX app version 1.0.11. Update MultiversX app to continue'
    );
  });
});
