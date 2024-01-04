if (typeof TextDecoder === 'undefined') {
  const nodeVer = typeof process !== 'undefined' && process.versions?.node;
  const nodeRequire = nodeVer
    ? // @ts-expect-error Isomorphism.
      typeof __webpack_require__ === 'function'
      ? // @ts-expect-error Isomorphism.
        __non_webpack_require__
      : // @ts-expect-error Isomorphism.
        require
    : undefined;
  globalThis['TextDecoder'] = nodeRequire('util').TextDecoder;
}
