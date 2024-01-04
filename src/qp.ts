import './globals.js';

const CHAR_SPACE = 0x20;

export function decodeQAndQP(
  input: string,
  encoding?: undefined,
  isQ?: boolean
): Uint8Array;
export function decodeQAndQP(
  input: string,
  encoding: string,
  isQ?: boolean
): string;
export function decodeQAndQP(
  input: string,
  encoding?: string | undefined,
  isQ?: boolean
): string | Uint8Array;
export function decodeQAndQP(input: string, encoding?: string, isQ = false) {
  const lines = input.replace(/\r/g, '').split('\n');
  let tempStr = '';

  for (let line of lines) {
    if (line.endsWith('=')) {
      tempStr += line.substring(0, line.length - 1);
    } else {
      tempStr += line + '\n';
    }
  }

  if (tempStr.endsWith('\n')) {
    tempStr = tempStr.substring(0, tempStr.length - 1);
  }

  const bytes: number[] = [];
  for (let i = 0; i < tempStr.length; i++) {
    const char = tempStr.charAt(i);
    const charCode = tempStr.charCodeAt(i);

    switch (char) {
      case '=':
        const hex = parseInt(tempStr.charAt(i + 1) + tempStr.charAt(i + 2), 16);
        if (hex) {
          bytes.push(hex);
          i += 2;
        } else {
          bytes.push(charCode);
        }
        break;
      case '_':
        bytes.push(isQ ? CHAR_SPACE : charCode);
        break;
      default:
        bytes.push(charCode);
    }
  }

  const typedArray = Uint8Array.from(bytes);
  if (encoding) {
    const decoder = new TextDecoder(encoding);
    return decoder.decode(typedArray);
  } else {
    return typedArray;
  }
}

/**
 * Decodes Quoted-Printable (RFC 2045) strings.
 * @param input
 * @param encoding Encoding of the input, omit the argument for the function to return an UInt8Array.
 */
export function decodeQuotedPrintable(input: string): Uint8Array;
export function decodeQuotedPrintable(input: string, encoding: string): string;
export function decodeQuotedPrintable(
  input: string,
  encoding?: string | undefined
): string | Uint8Array;
export function decodeQuotedPrintable(input: string, encoding?: string) {
  return decodeQAndQP(input, encoding, false);
}
