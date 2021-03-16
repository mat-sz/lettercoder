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

  it('decodes Quoted-Printable', () => {
    expect(
      decodeQuotedPrintable(
        "Now's the time =\nfor all folk to come=\n to the aid of their country.",
        'utf-8'
      )
    ).toBe("Now's the time for all folk to come to the aid of their country.");

    expect(
      decodeQuotedPrintable(
        "J'interdis aux marchands de vanter trop leurs marchandises. Car ils se font =\nvite p=C3=A9dagogues et t'enseignent comme but ce qui n'est par essence qu'=\nun moyen, et te trompant ainsi sur la route =C3=A0 suivre les voil=C3=A0 bi=\nent=C3=B4t qui te d=C3=A9gradent, car si leur musique est vulgaire ils te f=\nabriquent pour te la vendre une =C3=A2me vulgaire.",
        'utf-8'
      )
    ).toBe(
      "J'interdis aux marchands de vanter trop leurs marchandises. Car ils se font vite pédagogues et t'enseignent comme but ce qui n'est par essence qu'un moyen, et te trompant ainsi sur la route à suivre les voilà bientôt qui te dégradent, car si leur musique est vulgaire ils te fabriquent pour te la vendre une âme vulgaire."
    );

    expect(decodeQuotedPrintable('=F0=9F=91=8D', 'utf-8')).toBe('👍');

    expect(decodeQuotedPrintable('=DE=AD=BE=EF')).toEqual(
      Uint8Array.from([0xde, 0xad, 0xbe, 0xef])
    );

    expect(decodeQuotedPrintable('____', 'utf-8')).toBe('____');
  });

  it('handles multiple mime words properly', () => {
    expect(decodeMimeWords('=?ISO-8859-1?Q?a?= b')).toBe('a b');
    expect(decodeMimeWords('a =?ISO-8859-1?Q?a?= b')).toBe('a a b');
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

    expect(decodeMimeWords('=?ISO-8859-1?Q?a_b_c?= b')).toBe('a b c b');
  });

  it('handles the lack of mime words properly', () => {
    expect(decodeMimeWords('a b')).toBe('a b');
    expect(decodeMimeWords('a@b.com')).toBe('a@b.com');
    expect(decodeMimeWords('text/plain')).toBe('text/plain');
  });
});
