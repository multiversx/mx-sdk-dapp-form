import BigNumber from 'bignumber.js';
import { testAddress } from '__mocks__';
import { NftEnumType, TransactionTypeEnum } from 'types';
import {
  computeTokenDataField,
  computeNftDataField,
  getDataField
} from '../computeDataField';
import getTokenDetails from '../getTokenDetails';
import { bech32 } from 'helpers/transformations';

jest.mock('../getTokenDetails');

const evenLengthValue = (value: string) =>
  value.length % 2 === 0 ? value : `0${value}`;

describe('computeDataField', () => {
  const mockNft = {
    collection: 'WEGLD-123456',
    nonce: 123456,
    type: NftEnumType.NonFungibleESDT,
    decimals: 0,
    identifier: 'WEGLD-123456',
    name: 'WEGLD',
    balance: '1',
    ticker: 'WEGLD',
    owner: testAddress,
    creator: testAddress
  };

  describe('computeTokenDataField', () => {
    it('should compute token data field correctly', () => {
      const amount = '100';
      const decimals = 18;
      const tokenId = 'WEGLD-123456';
      const isDeposit = false;

      const result = computeTokenDataField({
        amount,
        decimals,
        tokenId,
        isDeposit
      });

      expect(result).toContain('ESDTTransfer');
      expect(result).toContain(Buffer.from(tokenId).toString('hex'));
      expect(result).not.toContain(Buffer.from('deposit').toString('hex'));
    });

    it('should add deposit hex when isDeposit is true', () => {
      const amount = '100';
      const decimals = 18;
      const tokenId = 'WEGLD-123456';
      const isDeposit = true;

      const result = computeTokenDataField({
        amount,
        decimals,
        tokenId,
        isDeposit
      });

      expect(result).toContain(Buffer.from('deposit').toString('hex'));
    });

    it('should use ZERO when amount is empty', () => {
      const amount = '';
      const decimals = 18;
      const tokenId = 'WEGLD-123456';
      const isDeposit = false;

      const result = computeTokenDataField({
        amount,
        decimals,
        tokenId,
        isDeposit
      });

      expect(result).toContain(Buffer.from(tokenId).toString('hex'));
    });
  });

  describe('computeNftDataField', () => {
    it('should compute NFT data field correctly', () => {
      const amount = '1';
      const receiver = testAddress;
      const errors = false;
      const isDeposit = false;

      const result = computeNftDataField({
        nft: mockNft,
        amount,
        receiver,
        errors,
        isDeposit
      });

      expect(result).toContain('ESDTNFTTransfer');
      expect(result).toContain(Buffer.from(mockNft.collection).toString('hex'));
      const expectedNonce = new BigNumber(String(mockNft.nonce)).toString(16);
      expect(result).toContain(
        expectedNonce.length % 2 === 0 ? expectedNonce : `0${expectedNonce}`
      );
      const expectedAmount = new BigNumber(amount).toString(16);
      expect(result).toContain(
        expectedAmount.length % 2 === 0 ? expectedAmount : `0${expectedAmount}`
      );
      expect(result).not.toContain(Buffer.from('deposit').toString('hex'));
    });

    it('should add deposit hex when isDeposit is true', () => {
      const amount = '1';
      const receiver = testAddress;
      const errors = false;
      const isDeposit = true;

      const result = computeNftDataField({
        nft: mockNft,
        amount,
        receiver,
        errors,
        isDeposit
      });

      expect(result).toContain(Buffer.from('deposit').toString('hex'));
    });

    it('should return empty string when there are errors', () => {
      const amount = '1';
      const receiver = testAddress;
      const errors = true;
      const isDeposit = false;

      const result = computeNftDataField({
        nft: mockNft,
        amount,
        receiver,
        errors,
        isDeposit
      });

      expect(result).toBe('');
    });

    it('should return empty string when nft is undefined', () => {
      const amount = '1';
      const receiver = testAddress;
      const errors = false;
      const isDeposit = false;

      const result = computeNftDataField({
        nft: undefined,
        amount,
        receiver,
        errors,
        isDeposit
      });

      expect(result).toBe('');
    });

    it('should handle MetaESDT type correctly', () => {
      const metaNft = {
        ...mockNft,
        type: NftEnumType.MetaESDT,
        decimals: 18
      };
      const amount = '1';
      const receiver = testAddress;
      const errors = false;
      const isDeposit = false;

      const data = computeNftDataField({
        nft: metaNft,
        amount,
        receiver,
        errors,
        isDeposit
      });

      const expected = [
        'ESDTNFTTransfer',
        Buffer.from(metaNft.collection).toString('hex'),
        evenLengthValue(new BigNumber(String(metaNft.nonce)).toString(16)),
        evenLengthValue(new BigNumber('1000000000000000000').toString(16)),
        bech32.decode(receiver)
      ].join('@');

      expect(data).toBe(expected);
    });
  });

  describe('getDataField', () => {
    const mockValues = {
      tokens: [
        {
          identifier: 'WEGLD-123456',
          decimals: 18,
          name: 'WEGLD',
          balance: '1000',
          ticker: 'WEGLD'
        }
      ],
      tokenId: 'WEGLD-123456',
      amount: '100',
      receiver: testAddress,
      data: 'custom data',
      address: testAddress,
      balance: '1000',
      chainId: 'D',
      txType: TransactionTypeEnum.ESDT,
      gasLimit: '50000',
      gasPrice: '1000000000'
    };

    beforeEach(() => {
      (getTokenDetails as jest.Mock).mockReturnValue({ decimals: 18 });
    });

    it('should call computeTokenDataField for ESDT transaction type', () => {
      const txType = TransactionTypeEnum.ESDT;
      const amountError = false;
      const receiverError = '';
      const isDeposit = false;

      const result = getDataField({
        txType,
        values: mockValues,
        amountError,
        receiverError,
        isDeposit
      });

      expect(getTokenDetails).toHaveBeenCalledWith({
        tokens: mockValues.tokens,
        tokenId: mockValues.tokenId
      });
      expect(result).toContain('ESDTTransfer');
    });

    it('should call computeNftDataField for NFT transaction type', () => {
      const txType = TransactionTypeEnum.NonFungibleESDT;
      const amountError = false;
      const receiverError = '';
      const isDeposit = false;

      const result = getDataField({
        txType,
        values: mockValues,
        nft: mockNft,
        amountError,
        receiverError,
        isDeposit
      });

      expect(result).toContain('ESDTNFTTransfer');
    });

    it('should return values.data for EGLD transaction type', () => {
      const txType = TransactionTypeEnum.EGLD;
      const amountError = false;
      const receiverError = '';
      const isDeposit = false;

      const result = getDataField({
        txType,
        values: mockValues,
        amountError,
        receiverError,
        isDeposit
      });

      expect(result).toBe(mockValues.data);
    });

    it('should handle amountError for ESDT transaction type', () => {
      const txType = TransactionTypeEnum.ESDT;
      const amountError = true;
      const receiverError = '';
      const isDeposit = false;

      const result = getDataField({
        txType,
        values: mockValues,
        amountError,
        receiverError,
        isDeposit
      });

      expect(result).not.toContain('ESDTTransfer');
    });

    it('should handle receiverError for NFT transaction type', () => {
      const txType = TransactionTypeEnum.NonFungibleESDT;
      const amountError = false;
      const receiverError = 'Invalid receiver';
      const isDeposit = false;

      const result = getDataField({
        txType,
        values: mockValues,
        nft: mockNft,
        amountError,
        receiverError,
        isDeposit
      });

      expect(result).toBe('');
    });
  });
});
