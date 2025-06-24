import React from 'react';
import { testAddress } from '__mocks__';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { renderForm } from 'tests/helpers/renderForm';
import { GuardianScreenType } from 'types';
import { ValuesEnum } from 'types/form';
import { formConfiguration, sendAndConfirmTest } from './helpers';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

const GuardianScreen = (props: GuardianScreenType) => {
  return (
    <div data-testid='guardianScreen'>
      <button onClick={props.onPrev} data-testid='guardianBackButton'>
        Back
      </button>
    </div>
  );
};

describe('Guardian screen tests', () => {
  test('Guardian screen visibility and navigation', async () => {
    const methods = renderForm({
      balance: '1_000_000_000_000_000'.replaceAll('_', ''), // 0.001,
      isGuarded: true,
      GuardianScreen,
      formConfigValues: {
        ...formConfiguration
      }
    });

    const receiver: any = await methods.findByTestId(ValuesEnum.receiver);

    await userEvent.clear(receiver);
    await userEvent.type(receiver, testAddress);
    await userEvent.tab();

    const amount: any = await methods.findByTestId(ValuesEnum.amount);
    await userEvent.clear(amount);
    await userEvent.type(amount, '0.00001');
    await userEvent.tab();

    const sendButton = await methods.findByTestId(FormDataTestIdsEnum.sendBtn);
    await userEvent.click(sendButton);
    await sleep(1000);

    const gasLimitError = await methods.findByTestId(
      FormDataTestIdsEnum.gasLimitError
    );

    expect(gasLimitError).toBeDefined();

    await sendAndConfirmTest({ methods })({
      amount: '0.00001',
      fee: '0.0000505 xEGLD'
    });

    // account is guarded and has GuardianComponent
    // after pressing send, GuardianScreen should be visible
    const sendTransactionBtn = await methods.findByTestId(
      FormDataTestIdsEnum.sendTrxBtn
    );
    await userEvent.click(sendTransactionBtn);
    const guardianScreen = await methods.findByTestId(
      FormDataTestIdsEnum.guardianScreen
    );
    expect(guardianScreen).toBeDefined();

    // on Guardian screen back, Confirm Screen should be visible
    const guardianBackButton = methods.getByTestId('guardianBackButton');
    await userEvent.click(guardianBackButton);
    const confirmScreen = await methods.findByTestId('confirmScreen');
    expect(confirmScreen).toBeDefined();
  });
});
