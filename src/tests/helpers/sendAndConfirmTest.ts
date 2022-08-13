import { fireEvent, RenderResult } from '@testing-library/react';

interface ConfirmScreenType {
  methods: RenderResult;
}

interface ConfirmScreenPropsType {
  amount?: string;
  data?: string;
  fee?: string;
}

export const sendAndConfirmTest = ({ methods }: ConfirmScreenType) => async ({
  amount,
  fee,
  data
}: ConfirmScreenPropsType) => {
  const sendButton = methods.getByTestId('sendBtn');
  fireEvent.click(sendButton);
  const confirmScreen = await methods.findByTestId('confirmScreen');

  if (amount != null) {
    expect(methods.getByTestId('confirmAmount').textContent).toBe(amount);
  }

  if (fee != null) {
    expect(methods.getByTestId('confirmFee').textContent?.toString()).toContain(
      fee + '\u00a0xEGLD'
    );
  }

  if (data != null) {
    expect(methods.getByTestId('confirmData').textContent).toBe(data);
  }

  expect(confirmScreen).toBeDefined();
};
