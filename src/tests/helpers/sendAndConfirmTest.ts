import { fireEvent, RenderResult, waitFor } from '@testing-library/react';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';

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
    const feeLimit: any = methods.getByTestId(FormDataTestIdsEnum.feeLimit);

    // wait for fee update before
    await waitFor(() => {
      expect(feeLimit.textContent).toContain(fee);
    });

    const sendButton = methods.getByTestId(FormDataTestIdsEnum.sendBtn);
    fireEvent.click(sendButton);
    const confirmScreen = await methods.findByTestId('confirmScreen');

    if (amount != null) {
      expect(methods.getByTestId('confirmAmount').textContent).toBe(amount);
    }

    if (fee != null) {
      expect(
        methods.getByTestId('confirmFee').textContent?.toString()
      ).toContain(fee);
    }

    if (data != null) {
      expect(methods.getByTestId('confirmData').textContent).toBe(data);
    }

    expect(confirmScreen).toBeDefined();
  };
