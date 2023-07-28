import React from 'react';
import { GuardianScreenType } from '@multiversx/sdk-dapp/types/transactions.types';
import { fireEvent } from '@testing-library/react';
import { testAddress } from '__mocks__';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';
import { formConfiguration, sendAndConfirmTest } from './helpers';

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

    fireEvent.change(receiver, { target: { value: testAddress } });

    const amount: any = await methods.findByTestId(ValuesEnum.amount);
    fireEvent.change(amount, { target: { value: '0.00001' } });
    fireEvent.blur(amount, { target: { value: '0.00001' } });

    const sendButton = methods.getByTestId('sendBtn');
    fireEvent.click(sendButton);

    await sendAndConfirmTest({ methods })({
      amount: '0.00001',
      fee: '0.0000505 xEGLD'
    });

    // account is guarded and has GuardianComponent
    // after pressing send, GuardianScreen should be visible
    const sendTransactionBtn = methods.getByTestId('sendTrxBtn');
    fireEvent.click(sendTransactionBtn);
    const guardianScreen = await methods.findByTestId('guardianScreen');
    expect(guardianScreen).toBeDefined();

    // on Guardian screen back, Confirm Screen should be visible
    const guardianBackButton = methods.getByTestId('guardianBackButton');
    fireEvent.click(guardianBackButton);
    const confirmScreen = await methods.findByTestId('confirmScreen');
    expect(confirmScreen).toBeDefined();
  });
});
