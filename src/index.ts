import { toByteArray } from 'base64-js';

if (typeof TextDecoder === 'undefined') {
  // @ts-ignore Isomorphism.
  global['TextDecoder'] = require('util').TextDecoder;
}

/**
 * Decodes strings containing multiple MIME words (RFC 2047).
 * @param input
 */
export function decodeMimeWords(input: string) {
  return input
    .split(' ')
    .map(word => decodeMimeWord(word))
    .join(' ');
}

/**
 * Decodes one MIME word (RFC 2047). Note: if an input contains more than one RFC 822 atom (i.e. input contains spaces) no decoding will be performed, use decodeMimeWords instead.
 * @param input
 */
export function decodeMimeWord(input: string) {
  if (!input.startsWith('=?') || !input.endsWith('?=') || input.includes(' ')) {
    return input;
  }

  const split = input.split('?');
  if (split.length !== 5) {
    return input;
  }

  let [encoding, type, value] = split.slice(1, 4);

  // Remove language tag.
  encoding = encoding.split('*')[0].toLowerCase();
  type = type.toLowerCase();

  switch (type) {
    case 'b':
      const bytes = toByteArray(value);
      if (bytes) {
        const decoder = new TextDecoder(encoding);
        return decoder.decode(bytes);
      } else {
        return input;
      }
    case 'q':
      return decodeQuotedPrintable(value, true);
    default:
      return input;
  }
}

/**
 * Decodes Quoted-Printable (RFC 2045) strings.
 * @param input
 */
export function decodeQuotedPrintable(input: string, ignoreLines = false) {
  const lines = input.replace(/\r/g, '').split('\n');
  let tempStr = '';
  let output = '';

  if (ignoreLines) {
    tempStr = input;
  } else {
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
  }

  for (let i = 0; i < tempStr.length; i++) {
    const char = tempStr.charAt(i);
    switch (char) {
      case '=':
        const hex = parseInt(tempStr.charAt(i + 1) + tempStr.charAt(i + 2), 16);
        if (hex) {
          output += String.fromCharCode(hex);
          i += 2;
        } else {
          output += char;
        }
        break;
      case '_':
        output += ' ';
        break;
      default:
        output += char;
    }
  }

  return output;
}
