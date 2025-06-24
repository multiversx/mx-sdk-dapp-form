import { waitFor } from '@testing-library/react';
import { testAddress, testNetwork, testReceiver } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import {
  formConfiguration,
  renderForm as beginAll,
  sendAndConfirmTest
} from 'tests/helpers';
import { ValuesEnum } from 'types/form';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

const sftToken = {
  identifier: 'CNTMBLT-efb397-01',
  collection: 'CNTMBLT-efb397',
  nonce: 1,
  type: 'SemiFungibleESDT',
  name: 'Confirmed Won',
  creator: 'erd1qqqqqqqqqqqqqpgqgl22w4ucmwvst7pnqpfsfm0rkvant2lzad7qjcvhhh',
  royalties: 0,
  media: [
    {
      url: 'https://media.multiversx.com/nfts/thumbnail/default.png',
      originalUrl: 'https://media.multiversx.com/nfts/thumbnail/default.png',
      thumbnailUrl: 'https://media.multiversx.com/nfts/thumbnail/default.png',
      fileType: 'image/png',
      fileSize: 29512
    }
  ],
  isWhitelistedStorage: false,
  metadata: {},
  balance: '1',
  ticker: 'CNTMBLT-efb397'
};

const beforAllTokens = (balance?: string) =>
  beginAll({
    formConfigValues: {
      ...formConfiguration,
      tokenId: sftToken.identifier
    },
    ...(balance ? { balance } : {})
  });

describe('Send SFT tokens', () => {
  beforeEach(() => {
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testAddress}/nfts/${sftToken.identifier}`,
        mockResponse(sftToken)
      )
    );
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testAddress}/nfts`,
        mockResponse([sftToken])
      )
    );
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testReceiver}`,
        mockResponse({})
      )
    );
  });
  test('Sft send', async () => {
    const methods = beforAllTokens();

    // fill in receiver
    const receiver = await methods.findByTestId(ValuesEnum.receiver);

    await userEvent.clear(receiver);
    await userEvent.type(receiver, testAddress);
    await userEvent.tab();

    await sleep(1000);

    await waitFor(() => {
      const receiverError = methods.getByTestId(
        FormDataTestIdsEnum.receiverError
      );
      expect(receiverError.innerHTML).toBe('Same as owner address');
    });

    await userEvent.clear(receiver);
    await userEvent.type(receiver, testReceiver);
    await userEvent.tab();
    await sleep(1000);

    const tokenPreview = methods.getByTestId('token-preview');
    const tokenPreviewName = methods.getByTestId('token-preview-name');
    const tokenPreviewIdentifier = methods.getByTestId(
      'token-preview-identifier'
    );

    await waitFor(() => {
      expect(tokenPreview).toBeInTheDocument();
      expect(tokenPreviewName.textContent).toBe('Confirmed Won');
      expect(tokenPreviewIdentifier.textContent).toBe('CNTMBLT-efb397-01');
    });

    // check available
    const available = methods.getByTestId(`available-${sftToken.identifier}`);
    expect(available.textContent).toBe('1 CNTMBLT-efb397');

    const entireTokenBalaceButton = await methods.findByText('Max');
    await userEvent.click(entireTokenBalaceButton);

    const amountInput = await methods.findByTestId(ValuesEnum.amount);
    const processedAmountInput = amountInput as HTMLInputElement;

    await waitFor(() => {
      expect(processedAmountInput.value).toBe('1');
    });

    // test sending decimals
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '1.1');
    await userEvent.tab();
    await sleep(1000);

    await waitFor(() => {
      const req = methods.queryByText('Invalid number');
      expect(req?.innerHTML).toBe('Invalid number');
    });

    // test funds
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '2');
    await userEvent.tab();
    await sleep(1000);
    await waitFor(() => {
      const req = methods.queryByText('Insufficient funds');
      expect(req?.innerHTML).toBe('Insufficient funds');
    });

    // test zero
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '0');
    await userEvent.tab();
    await sleep(1000);
    await waitFor(() => {
      const req = methods.queryByText('Cannot be zero');
      expect(req?.innerHTML).toBe('Cannot be zero');
    });

    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '1');
    await userEvent.tab();

    const data: any = await methods.findByTestId(ValuesEnum.data);

    const dataString =
      'ESDTNFTTransfer@434e544d424c542d656662333937@01@01@000000000000000005000e8a594d1c9b52073fcd3c856c87986045c85f568b98';

    await waitFor(() => {
      expect(data.value).toBe(dataString);
    });
    expect(data.disabled).toBeTruthy(); // check disabled

    const gasLimitInput = methods.getByTestId(ValuesEnum.gasLimit);
    const processedGasLimitInput = gasLimitInput as HTMLInputElement;
    expect(processedGasLimitInput.value).toBe('1,000,000');

    await userEvent.clear(processedGasLimitInput);
    await userEvent.type(processedGasLimitInput, '100000');
    await userEvent.tab();
    await sleep(1000);
    await waitFor(() => {
      const gasLimitError = methods.getByTestId(
        FormDataTestIdsEnum.gasLimitError
      );
      expect(gasLimitError.textContent).toBe(
        'Gas limit must be greater or equal to 1000000'
      );
    });

    // reset gasLimit
    const gasLimitResetBtn = await methods.findByTestId(
      FormDataTestIdsEnum.gasLimitResetBtn
    );

    await userEvent.click(gasLimitResetBtn);
    await sleep(1000);
    expect(processedGasLimitInput.value).toBe('1,000,000');

    await sendAndConfirmTest({ methods })({
      amount: '1',
      fee: '0.0000595 xEGLD'
    });
  });
});
