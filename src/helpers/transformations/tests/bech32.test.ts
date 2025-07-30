import { testAddress } from '__mocks__';
import { bech32 } from '../bech32';

describe('bech32 tests', () => {
  describe('encode', () => {
    test('encodes valid public key to bech32 address', () => {
      const publicKey =
        'fd691bb5e85d102687d81079dffce842d4dc328276d2d4c60d8fd1c3433c3293';
      const result = bech32.encode(publicKey);
      expect(result).toBe(
        'erd1l453hd0gt5gzdp7czpuall8ggt2dcv5zwmfdf3sd3lguxseux2fsmsgldz'
      );
    });

    test('encodes different valid public key to bech32 address', () => {
      const publicKey =
        '0139472eff6886771a982f3083da5d421f24c29181e63888228dc81ca60d69e1';
      const result = bech32.encode(publicKey);
      expect(result).toBe(
        'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th'
      );
    });

    test('throws error for invalid public key', () => {
      const invalidPublicKey = 'invalid';
      expect(() => bech32.encode(invalidPublicKey)).toThrow();
    });

    test('throws error for empty public key', () => {
      const emptyPublicKey = '';
      expect(() => bech32.encode(emptyPublicKey)).toThrow();
    });

    test('throws error for non-hex public key', () => {
      const nonHexPublicKey =
        'gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg';
      expect(() => bech32.encode(nonHexPublicKey)).toThrow();
    });
  });

  describe('decode', () => {
    test('decodes valid bech32 address to hex public key', () => {
      const result = bech32.decode(testAddress);
      expect(result).toBe(
        '8049d639e5a6980d1cd2392abcce41029cda74a1563523a202f09641cc2618f8'
      );
    });

    test('decodes different valid bech32 address to hex public key', () => {
      const result = bech32.decode(testAddress);
      expect(result).toBe(
        '8049d639e5a6980d1cd2392abcce41029cda74a1563523a202f09641cc2618f8'
      );
    });

    test('throws error for invalid bech32 address', () => {
      const invalidAddress = 'invalid-address';
      expect(() => bech32.decode(invalidAddress)).toThrow();
    });

    test('throws error for empty address', () => {
      const emptyAddress = '';
      expect(() => bech32.decode(emptyAddress)).toThrow();
    });

    test('throws error for address with wrong prefix', () => {
      const wrongPrefixAddress =
        'moa1l453hdw9t5gx2rlqyz7hlnwgzkp6msezykx62nrxr3lwr0s6cx2feudk0k';
      expect(() => bech32.decode(wrongPrefixAddress)).toThrow();
    });

    test('throws error for malformed bech32 address', () => {
      const malformedAddress = 'erd1invalid';
      expect(() => bech32.decode(malformedAddress)).toThrow();
    });
  });

  describe('encode/decode roundtrip', () => {
    test('encoding then decoding returns original public key', () => {
      const originalPublicKey =
        'fd691bb5e85d102687d81079dffce842d4dc328276d2d4c60d8fd1c3433c3293';
      const encoded = bech32.encode(originalPublicKey);
      const decoded = bech32.decode(encoded);
      expect(decoded).toBe(originalPublicKey);
    });

    test('decoding then encoding returns original address', () => {
      const decoded = bech32.decode(testAddress);
      const encoded = bech32.encode(decoded);
      expect(encoded).toBe(testAddress);
    });
  });
});
