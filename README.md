<h1 align="center">
  lettercoder
</h1>

<p align="center">
<img alt="workflow" src="https://img.shields.io/github/workflow/status/mat-sz/lettercoder/Node.js%20CI%20(yarn)">
<a href="https://npmjs.com/package/lettercoder">
<img alt="npm" src="https://img.shields.io/npm/v/lettercoder">
<img alt="npm" src="https://img.shields.io/npm/dw/lettercoder">
<img alt="NPM" src="https://img.shields.io/npm/l/lettercoder">
</a>
</p>

**lettercoder** is an isomorphic decoding library for e-mail related applications written in TypeScript.

The following RFCs are supported by lettercoder:

- [RFC 2045](https://tools.ietf.org/html/rfc2045.html) (Quoted-Printable)
- [RFC 2047](https://tools.ietf.org/html/rfc2047.html) (MIME Words)

## Usage

### String with mixed MIME words and regular words (RFC 2047)

```ts
import { decodeMimeWords } from 'lettercoder';

decodeMimeWords('=?ISO-8859-1?Q?a?= b'); // a b
```

### One MIME word (RFC 2047)

```ts
import { decodeMimeWord } from 'lettercoder';

decodeMimeWords('=?ISO-8859-1?Q?a?='); // a
```

### Quoted-Printable: UTF-8 (RFC 2045)

```ts
import { decodeQuotedPrintable } from 'lettercoder';

decodeQuotedPrintable('=F0=9F=91=8D', 'utf-8'); // 👍
```

### Quoted-Printable: Byte array (RFC 2045)

```ts
import { decodeQuotedPrintable } from 'lettercoder';

decodeQuotedPrintable('=DE=AD=BE=EF'); // Uint8Array(4) [ 222, 173, 190, 239 ]
```
