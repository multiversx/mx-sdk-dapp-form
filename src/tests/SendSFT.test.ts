import { fireEvent, waitFor } from '@testing-library/react';
import { testAddress, testNetwork, testReceiver } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import {
  formConfiguration,
  renderForm as beginAll,
  sendAndConfirmTest
} from 'tests/helpers';

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
    const receiver: any = await methods.findByTestId('receiver');

    fireEvent.change(receiver, { target: { value: testAddress } });
    fireEvent.blur(receiver);

    await waitFor(() => {
      const receiverError = methods.getByTestId('receiverError');
      expect(receiverError.innerHTML).toBe('Same as owner address');
    });

    fireEvent.change(receiver, { target: { value: testReceiver } });
    fireEvent.blur(receiver);

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
    expect(available.innerHTML).toBe('1 CNTMBLT-efb397');

    const entireTokenBalaceButton = await methods.findByText('Max');
    fireEvent.click(entireTokenBalaceButton);

    const amountInput: any = await methods.findByTestId('amount');

    await waitFor(() => {
      expect(amountInput.value).toBe('1');
    });

    // test sending decimals
    fireEvent.change(amountInput, { target: { value: '1.1' } });
    fireEvent.blur(amountInput);

    await waitFor(() => {
      const req = methods.queryByText('Invalid number');
      expect(req?.innerHTML).toBe('Invalid number');
    });

    // test funds
    fireEvent.change(amountInput, { target: { value: '2' } });
    fireEvent.blur(amountInput);

    await waitFor(() => {
      const req = methods.queryByText('Insufficient funds');
      expect(req?.innerHTML).toBe('Insufficient funds');
    });

    // test zero
    fireEvent.change(amountInput, { target: { value: '0' } });
    fireEvent.blur(amountInput);

    await waitFor(() => {
      const req = methods.queryByText('Cannot be zero');
      expect(req?.innerHTML).toBe('Cannot be zero');
    });

    fireEvent.change(amountInput, { target: { value: '1' } });
    fireEvent.blur(amountInput);

    const data: any = await methods.findByTestId('data');

    const dataString =
      'ESDTNFTTransfer@434e544d424c542d656662333937@01@01@000000000000000005000e8a594d1c9b52073fcd3c856c87986045c85f568b98';

    await waitFor(() => {
      expect(data.value).toBe(dataString);
    });
    expect(data.disabled).toBeTruthy(); // check disabled

    const gasLimit: any = methods.getByTestId('gasLimit');
    expect(gasLimit.value).toBe('1000000');

    fireEvent.change(gasLimit, { target: { value: '100000' } });
    fireEvent.blur(gasLimit);

    await waitFor(() => {
      const gasLimitError = methods.getByTestId('gasLimitError');
      expect(gasLimitError.textContent).toBe(
        'Gas limit must be greater or equal to 1000000'
      );
    });

    // reset gasLimit
    const gasLimitResetBtn = methods.getByTestId('gasLimitResetBtn');
    fireEvent.click(gasLimitResetBtn);

    expect(gasLimit.value).toBe('1000000');

    await sendAndConfirmTest({ methods })({
      amount: '1',
      fee: '0.0000595'
    });
  });
});
