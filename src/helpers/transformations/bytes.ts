/**
 * Browser-native replacements for the `Buffer` calls
 */

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/** UTF-8 encodes a string. Replaces `Buffer.from(value)`. */
export const stringToBytes = (value: string): Uint8Array =>
  textEncoder.encode(value);

/** Length of a string in UTF-8 bytes. Replaces `Buffer.from(value).length`. */
export const byteLength = (value: string): number =>
  textEncoder.encode(value).length;

/**
 * Lowercase hex of a string's UTF-8 bytes.
 * Replaces `Buffer.from(value).toString('hex')`.
 */
export const stringToHex = (value: string): string =>
  Array.from(textEncoder.encode(value), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');

/**
 * Decodes base64 to a UTF-8 string.
 * Replaces `Buffer.from(value, 'base64').toString()`.
 */
export const base64ToString = (value: string): string => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return textDecoder.decode(bytes);
};
