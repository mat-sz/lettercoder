# lettercoder

**lettercoder** is an isomorphic decoding library for e-mail related applications written in TypeScript.

The following RFCs are supported by lettercoder:

- [RFC 2045](https://tools.ietf.org/html/rfc2045.html) (Quoted-Printable)
- [RFC 2047](https://tools.ietf.org/html/rfc2047.html) (MIME Words)

## Usage

```ts
import { decodeMimeWords } from 'lettercoder';

decodeMimeWords('=?ISO-8859-1?Q?a?='); // a
```
