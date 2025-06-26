import { RenderResult, waitFor } from '@testing-library/react';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { sleep } from './sleep';
import userEvent from '@testing-library/user-event';

interface ConfirmScreenType {
  methods: RenderResult;
}

interface ConfirmScreenPropsType {
  amount?: string;
  data?: string;
  fee: string;
}

export const sendAndConfirmTest =
  ({ methods }: ConfirmScreenType) =>
  async ({ amount, fee, data }: ConfirmScreenPropsType) => {
    const sendButton = await methods.findByTestId(FormDataTestIdsEnum.sendBtn);
    await userEvent.click(sendButton);
    await sleep();

    const [feeLimit]: any = await methods.findAllByTestId(
      FormDataTestIdsEnum.confirmFee
    );

    await waitFor(() => {
      expect(feeLimit.textContent).toContain(fee);
    });

    const confirmScreen = await methods.findByTestId('confirmScreen');

    if (amount != null) {
      const confirmAmount = methods.queryAllByTestId('confirmAmount')[0];
      expect(confirmAmount.textContent).toContain(amount);
    }

    if (fee != null) {
      const confirmFee = methods.queryAllByTestId('confirmFee')[0];
      expect(confirmFee.textContent).toContain(fee);
    }

    if (data != null) {
      expect((await methods.findByTestId('confirmData')).innerHTML).toBe(data);
    }

    expect(confirmScreen).toBeDefined();
  };
