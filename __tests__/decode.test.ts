import {
  decodeQuotedPrintable,
  decodeMimeWords,
  decodeMimeWord,
} from '../src/index';

describe('letterparser', () => {
  it('decodes MIME word examples from section 8 of RFC 2047', () => {
    expect(decodeMimeWord('=?US-ASCII?Q?Keith_Moore?=')).toBe('Keith Moore');
    expect(decodeMimeWord('=?ISO-8859-1?Q?Keld_J=F8rn_Simonsen?=')).toBe(
      'Keld Jørn Simonsen'
    );
    expect(decodeMimeWord('=?ISO-8859-1?Q?Andr=E9?=')).toBe('André');
    expect(
      decodeMimeWord('=?ISO-8859-1?B?SWYgeW91IGNhbiByZWFkIHRoaXMgeW8=?=')
    ).toBe('If you can read this yo');
    expect(
      decodeMimeWord('=?ISO-8859-2?B?dSB1bmRlcnN0YW5kIHRoZSBleGFtcGxlLg==?=')
    ).toBe('u understand the example.');
    expect(decodeMimeWord('=?ISO-8859-1?Q?Olle_J=E4rnefors?=')).toBe(
      'Olle Järnefors'
    );
    expect(decodeMimeWord('=?ISO-8859-1?Q?Patrik_F=E4ltstr=F6m?=')).toBe(
      'Patrik Fältström'
    );
    expect(decodeMimeWord('=?iso-8859-8?b?7eXs+SDv4SDp7Oj08A==?=')).toBe(
      'םולש ןב ילטפנ'
    );
  });

  it('decodes Quoted-Printable examples from RFC 2045', () => {
    expect(
      decodeQuotedPrintable(
        "Now's the time =\nfor all folk to come=\n to the aid of their country."
      )
    ).toBe("Now's the time for all folk to come to the aid of their country.");
  });

  it('handles multiple mime words properly', () => {
    expect(decodeMimeWords('=?ISO-8859-1?Q?a?= b')).toBe('a b');
    expect(decodeMimeWords('=?ISO-8859-1?Q?a?= =?ISO-8859-1?Q?b?=')).toBe('ab');
    expect(decodeMimeWords('=?ISO-8859-1?Q?a?=  =?ISO-8859-1?Q?b?=')).toBe(
      'ab'
    );
    expect(decodeMimeWords('=?ISO-8859-1?Q?a?=\n =?ISO-8859-1?Q?b?=')).toBe(
      'ab'
    );
    expect(
      decodeMimeWords(
        '=?ISO-8859-1?B?SWYgeW91IGNhbiByZWFkIHRoaXMgeW8=?= =?ISO-8859-2?B?dSB1bmRlcnN0YW5kIHRoZSBleGFtcGxlLg==?='
      )
    ).toBe('If you can read this you understand the example.');
  });
});
