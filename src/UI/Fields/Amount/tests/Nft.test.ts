import { fireEvent, waitFor } from '@testing-library/react';
import { testAddress, testNetwork, testReceiver } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import {
  formConfiguration,
  beforeAll as beginAll,
  sendAndConfirmTest
} from 'tests/helpers';

const nftToken = {
  identifier: 'NFT-f0806e-01',
  collection: 'NFT-f0806e',
  attributes:
    'dGFnczo7bWV0YWRhdGE6UW1SY1A5NGtYcjV6WmpSR3ZpN21KNnVuN0xweFVoWVZSNFI0UnBpY3h6Z1lrdA==',
  nonce: 1,
  type: 'NonFungibleESDT',
  name: 'NFT',
  creator: 'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
  royalties: 25,
  uris: [
    'aHR0cHM6Ly9pcGZzLmlvL2lwZnMvUW1aaHlUVjVLZTdFQ0VMOWVwc0RtNXpSdG5nQ2ZSMWk4em9adkJQM29RRHFOeg=='
  ],
  url:
    'https://testnet-media.elrond.com/nfts/asset/QmZhyTV5Ke7ECEL9epsDm5zRtngCfR1i8zoZvBP3oQDqNz',
  media: [
    {
      url:
        'https://testnet-media.elrond.com/nfts/asset/QmZhyTV5Ke7ECEL9epsDm5zRtngCfR1i8zoZvBP3oQDqNz',
      originalUrl:
        'https://ipfs.io/ipfs/QmZhyTV5Ke7ECEL9epsDm5zRtngCfR1i8zoZvBP3oQDqNz',
      thumbnailUrl:
        'https://testnet-media.elrond.com/nfts/thumbnail/NFT-f0806e-c432eb5a',
      fileType: 'image/png',
      fileSize: 64286
    }
  ],
  isWhitelistedStorage: true,
  tags: [''],
  metadata: {},
  ticker: 'NFT-f0806e',
  isNsfw: false
};

const beforAllTokens = (balance?: string) =>
  beginAll({
    formConfigValues: {
      ...{ ...formConfiguration, amount: '1' },
      tokenId: nftToken.identifier
    },
    ...(balance ? { balance } : {})
  });

describe('Send tokens', () => {
  beforeEach(() => {
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testAddress}/nfts/${nftToken.identifier}`,
        mockResponse(nftToken)
      )
    );
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testAddress}/nfts`,
        mockResponse([nftToken])
      )
    );
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testReceiver}`,
        mockResponse({})
      )
    );
  });
  test.only('Sft send', async () => {
    const methods = beforAllTokens();

    // fill in receiver
    const destinationAddress: any = await methods.findByTestId(
      'destinationAddress'
    );

    fireEvent.change(destinationAddress, { target: { value: testAddress } });
    fireEvent.blur(destinationAddress);

    await waitFor(() => {
      const destinationAddressError = methods.getByTestId('receiverError');
      expect(destinationAddressError.innerHTML).toBe('Same as owner address');
    });

    fireEvent.change(destinationAddress, { target: { value: testReceiver } });
    fireEvent.blur(destinationAddress);

    const tokenName = methods.getByTestId('tokenName');

    await waitFor(() => {
      expect(tokenName.textContent).toBe('NFT NFT-f0806e-01');
    });

    const data: any = await methods.findByTestId('data');
    fireEvent.blur(data);

    const dataString =
      'ESDTNFTTransfer@4e46542d663038303665@01@01@000000000000000005000e8a594d1c9b52073fcd3c856c87986045c85f568b98';

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
      fee: '0.000218395',
      data: dataString
    });
  });
});
