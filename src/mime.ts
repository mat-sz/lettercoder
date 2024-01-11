import { toByteArray } from 'base64-js';
import { decodeQAndQP } from './qp.js';

/**
 * Decodes strings containing multiple MIME words (RFC 2047).
 * @param input
 */
export function decodeMimeWords(input: string): string {
  const atoms = input.replace(/\s+/g, ' ').split(' ');
  let output = '';
  let wasMimeWord = false;

  for (let atom of atoms) {
    if (isMimeWord(atom)) {
      if (!wasMimeWord && output !== '') {
        output += ' ';
      }
      output += decodeMimeWord(atom);

      wasMimeWord = true;
    } else {
      if (output !== '') {
        output += ' ' + atom.trim();
      } else {
        output += atom.trim();
      }

      wasMimeWord = false;
    }
  }

  return output.trim();
}

export function isMimeWord(input: string): boolean {
  if (!input.startsWith('=?') || !input.endsWith('?=') || input.includes(' ')) {
    return false;
  }

  const split = input.split('?');
  if (split.length !== 5) {
    return false;
  }

  const type = split[2].toLowerCase();
  return type === 'q' || type === 'b';
}

/**
 * Decodes one MIME word (RFC 2047). Note: if an input contains more than one RFC 822 atom (i.e. input contains spaces) no decoding will be performed, use decodeMimeWords instead.
 * @param input
 */
export function decodeMimeWord(input: string): string {
  if (!isMimeWord(input)) {
    return input;
  }

  let [encoding, type, value] = input.split('?').slice(1, 4);

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
      return decodeQAndQP(value, encoding, true);
    default:
      return input;
  }
}
