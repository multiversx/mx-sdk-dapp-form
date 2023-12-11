import { validateSignTransactions } from '../validateSignTransactions';

describe('validateSignTransactions tests', () => {
  it('allows signing with zero gasLimit', async () => {
    const data = {
      extractedTxs: [
        {
          nonce: 2587,
          value: '0',
          receiver:
            'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
          sender:
            'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
          gasPrice: 1000000000,
          gasLimit: 0,
          data: 'ESDTNFTTransfer@42414e414e412d653935356664@0600@01@00000000000000000500d3b28828d62052124f07dcd50ed31b0825f60eee1526@616363657074476c6f62616c4f66666572@0127bb@',
          chainID: '1',
          version: 1
        }
      ],
      address: 'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
      egldLabel: 'EGLD',
      balance: '19291942886118844214',
      chainId: '1',
      apiConfig: {
        baseURL: 'https://internal-api.multiversx.com',
        timeout: 10
      }
    };
    const result = await validateSignTransactions(data);
    expect(result).toBeTruthy();
  });
});
