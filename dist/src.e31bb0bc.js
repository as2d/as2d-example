// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../node_modules/base64-js/index.js","ieee754":"../node_modules/ieee754/index.js","isarray":"../node_modules/isarray/index.js","buffer":"../node_modules/buffer/index.js"}],"../node_modules/assemblyscript/lib/loader/index.js":[function(require,module,exports) {
"use strict";

// Runtime header offsets
const ID_OFFSET = -8;
const SIZE_OFFSET = -4;

// Runtime ids
const ARRAYBUFFER_ID = 0;
const STRING_ID = 1;
const ARRAYBUFFERVIEW_ID = 2;

// Runtime type information
const ARRAYBUFFERVIEW = 1 << 0;
const ARRAY = 1 << 1;
const SET = 1 << 2;
const MAP = 1 << 3;
const VAL_ALIGN_OFFSET = 5;
const VAL_ALIGN = 1 << VAL_ALIGN_OFFSET;
const VAL_SIGNED = 1 << 10;
const VAL_FLOAT = 1 << 11;
const VAL_NULLABLE = 1 << 12;
const VAL_MANAGED = 1 << 13;
const KEY_ALIGN_OFFSET = 14;
const KEY_ALIGN = 1 << KEY_ALIGN_OFFSET;
const KEY_SIGNED = 1 << 19;
const KEY_FLOAT = 1 << 20;
const KEY_NULLABLE = 1 << 21;
const KEY_MANAGED = 1 << 22;

// Array(BufferView) layout
const ARRAYBUFFERVIEW_BUFFER_OFFSET = 0;
const ARRAYBUFFERVIEW_DATASTART_OFFSET = 4;
const ARRAYBUFFERVIEW_DATALENGTH_OFFSET = 8;
const ARRAYBUFFERVIEW_SIZE = 12;
const ARRAY_LENGTH_OFFSET = 12;
const ARRAY_SIZE = 16;

const BIGINT = typeof BigUint64Array !== "undefined";
const THIS = Symbol();
const CHUNKSIZE = 1024;

/** Gets a string from an U32 and an U16 view on a memory. */
function getStringImpl(buffer, ptr) {
  const U32 = new Uint32Array(buffer);
  const U16 = new Uint16Array(buffer);
  var length = U32[(ptr + SIZE_OFFSET) >>> 2] >>> 1;
  var offset = ptr >>> 1;
  if (length <= CHUNKSIZE) return String.fromCharCode.apply(String, U16.subarray(offset, offset + length));
  const parts = [];
  do {
    const last = U16[offset + CHUNKSIZE - 1];
    const size = last >= 0xD800 && last < 0xDC00 ? CHUNKSIZE - 1 : CHUNKSIZE;
    parts.push(String.fromCharCode.apply(String, U16.subarray(offset, offset += size)));
    length -= size;
  } while (length > CHUNKSIZE);
  return parts.join("") + String.fromCharCode.apply(String, U16.subarray(offset, offset + length));
}

/** Prepares the base module prior to instantiation. */
function preInstantiate(imports) {
  const baseModule = {};

  function getString(memory, ptr) {
    if (!memory) return "<yet unknown>";
    return getStringImpl(memory.buffer, ptr);
  }

  // add common imports used by stdlib for convenience
  const env = (imports.env = imports.env || {});
  env.abort = env.abort || function abort(mesg, file, line, colm) {
    const memory = baseModule.memory || env.memory; // prefer exported, otherwise try imported
    throw Error("abort: " + getString(memory, mesg) + " at " + getString(memory, file) + ":" + line + ":" + colm);
  }
  env.trace = env.trace || function trace(mesg, n) {
    const memory = baseModule.memory || env.memory;
    console.log("trace: " + getString(memory, mesg) + (n ? " " : "") + Array.prototype.slice.call(arguments, 2, 2 + n).join(", "));
  }
  imports.Math = imports.Math || Math;
  imports.Date = imports.Date || Date;

  return baseModule;
}

/** Prepares the final module once instantiation is complete. */
function postInstantiate(baseModule, instance) {
  const rawExports = instance.exports;
  const memory = rawExports.memory;
  const table = rawExports.table;
  const alloc = rawExports["__alloc"];
  const retain = rawExports["__retain"];
  const rttiBase = rawExports["__rtti_base"] || ~0; // oob if not present

  /** Gets the runtime type info for the given id. */
  function getInfo(id) {
    const U32 = new Uint32Array(memory.buffer);
    const count = U32[rttiBase >>> 2];
    if ((id >>>= 0) >= count) throw Error("invalid id: " + id);
    return U32[(rttiBase + 4 >>> 2) + id * 2];
  }

  /** Gets the runtime base id for the given id. */
  function getBase(id) {
    const U32 = new Uint32Array(memory.buffer);
    const count = U32[rttiBase >>> 2];
    if ((id >>>= 0) >= count) throw Error("invalid id: " + id);
    return U32[(rttiBase + 4 >>> 2) + id * 2 + 1];
  }

  /** Gets the runtime alignment of a collection's values. */
  function getValueAlign(info) {
    return 31 - Math.clz32((info >>> VAL_ALIGN_OFFSET) & 31); // -1 if none
  }

  /** Gets the runtime alignment of a collection's keys. */
  function getKeyAlign(info) {
    return 31 - Math.clz32((info >>> KEY_ALIGN_OFFSET) & 31); // -1 if none
  }

  /** Allocates a new string in the module's memory and returns its retained pointer. */
  function __allocString(str) {
    const length = str.length;
    const ptr = alloc(length << 1, STRING_ID);
    const U16 = new Uint16Array(memory.buffer);
    for (var i = 0, p = ptr >>> 1; i < length; ++i) U16[p + i] = str.charCodeAt(i);
    return ptr;
  }

  baseModule.__allocString = __allocString;

  /** Reads a string from the module's memory by its pointer. */
  function __getString(ptr) {
    const buffer = memory.buffer;
    const id = new Uint32Array(buffer)[ptr + ID_OFFSET >>> 2];
    if (id !== STRING_ID) throw Error("not a string: " + ptr);
    return getStringImpl(buffer, ptr);
  }

  baseModule.__getString = __getString;

  /** Gets the view matching the specified alignment, signedness and floatness. */
  function getView(alignLog2, signed, float) {
    const buffer = memory.buffer;
    if (float) {
      switch (alignLog2) {
        case 2: return new Float32Array(buffer);
        case 3: return new Float64Array(buffer);
      }
    } else {
      switch (alignLog2) {
        case 0: return new (signed ? Int8Array : Uint8Array)(buffer);
        case 1: return new (signed ? Int16Array : Uint16Array)(buffer);
        case 2: return new (signed ? Int32Array : Uint32Array)(buffer);
        case 3: return new (signed ? BigInt64Array : BigUint64Array)(buffer);
      }
    }
    throw Error("unsupported align: " + alignLog2);
  }

  /** Allocates a new array in the module's memory and returns its retained pointer. */
  function __allocArray(id, values) {
    const info = getInfo(id);
    if (!(info & (ARRAYBUFFERVIEW | ARRAY))) throw Error("not an array: " + id + " @ " + info);
    const align = getValueAlign(info);
    const length = values.length;
    const buf = alloc(length << align, ARRAYBUFFER_ID);
    const arr = alloc(info & ARRAY ? ARRAY_SIZE : ARRAYBUFFERVIEW_SIZE, id);
    const U32 = new Uint32Array(memory.buffer);
    U32[arr + ARRAYBUFFERVIEW_BUFFER_OFFSET >>> 2] = retain(buf);
    U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2] = buf;
    U32[arr + ARRAYBUFFERVIEW_DATALENGTH_OFFSET >>> 2] = length << align;
    if (info & ARRAY) U32[arr + ARRAY_LENGTH_OFFSET >>> 2] = length;
    const view = getView(align, info & VAL_SIGNED, info & VAL_FLOAT);
    if (info & VAL_MANAGED) {
      for (let i = 0; i < length; ++i) view[(buf >>> align) + i] = retain(values[i]);
    } else {
      view.set(values, buf >>> align);
    }
    return arr;
  }

  baseModule.__allocArray = __allocArray;

  /** Gets a view on the values of an array in the module's memory. */
  function __getArrayView(arr) {
    const U32 = new Uint32Array(memory.buffer);
    const id = U32[arr + ID_OFFSET >>> 2];
    const info = getInfo(id);
    if (!(info & ARRAYBUFFERVIEW)) throw Error("not an array: " + id);
    const align = getValueAlign(info);
    var buf = U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
    const length = info & ARRAY
      ? U32[arr + ARRAY_LENGTH_OFFSET >>> 2]
      : U32[buf + SIZE_OFFSET >>> 2] >>> align;
    return getView(align, info & VAL_SIGNED, info & VAL_FLOAT)
          .subarray(buf >>>= align, buf + length);
  }

  baseModule.__getArrayView = __getArrayView;

  /** Reads (copies) the values of an array from the module's memory. */
  function __getArray(arr) {
    const input = __getArrayView(arr);
    const len = input.length;
    const out = new Array(len);
    for (let i = 0; i < len; i++) out[i] = input[i];
    return out;
  }

  baseModule.__getArray = __getArray;

  /** Reads (copies) the data of an ArrayBuffer from the module's memory. */
  function __getArrayBuffer(ptr) {
    const buffer = memory.buffer;
    const length = new Uint32Array(buffer)[ptr + SIZE_OFFSET >>> 2];
    return buffer.slice(ptr, ptr + length);
  }

  baseModule.__getArrayBuffer = __getArrayBuffer;

  function getTypedArrayImpl(Type, alignLog2, ptr) {
    const buffer = memory.buffer;
    const U32 = new Uint32Array(buffer);
    const bufPtr = U32[ptr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
    return new Type(buffer, bufPtr, U32[bufPtr + SIZE_OFFSET >>> 2] >>> alignLog2);
  }

  /** Gets a view on the values of a known-to-be Int8Array in the module's memory. */
  baseModule.__getInt8Array = getTypedArrayImpl.bind(null, Int8Array, 0);
  /** Gets a view on the values of a known-to-be Uint8Array in the module's memory. */
  baseModule.__getUint8Array = getTypedArrayImpl.bind(null, Uint8Array, 0);
  /** Gets a view on the values of a known-to-be Uint8ClampedArray in the module's memory. */
  baseModule.__getUint8ClampedArray = getTypedArrayImpl.bind(null, Uint8ClampedArray, 0);
  /** Gets a view on the values of a known-to-be Int16Array in the module's memory. */
  baseModule.__getInt16Array = getTypedArrayImpl.bind(null, Int16Array, 1);
  /** Gets a view on the values of a known-to-be Uint16Array in the module's memory. */
  baseModule.__getUint16Array = getTypedArrayImpl.bind(null, Uint16Array, 1);
  /** Gets a view on the values of a known-to-be Int32Array in the module's memory. */
  baseModule.__getInt32Array = getTypedArrayImpl.bind(null, Int32Array, 2);
  /** Gets a view on the values of a known-to-be Uint32Array in the module's memory. */
  baseModule.__getUint32Array = getTypedArrayImpl.bind(null, Uint32Array, 2);
  if (BIGINT) {
    /** Gets a view on the values of a known-to-be-Int64Array in the module's memory. */
    baseModule.__getInt64Array = getTypedArrayImpl.bind(null, BigInt64Array, 3);
    /** Gets a view on the values of a known-to-be-Uint64Array in the module's memory. */
    baseModule.__getUint64Array = getTypedArrayImpl.bind(null, BigUint64Array, 3);
  }
  /** Gets a view on the values of a known-to-be Float32Array in the module's memory. */
  baseModule.__getFloat32Array = getTypedArrayImpl.bind(null, Float32Array, 2);
  /** Gets a view on the values of a known-to-be Float64Array in the module's memory. */
  baseModule.__getFloat64Array = getTypedArrayImpl.bind(null, Float64Array, 3);

  /** Tests whether an object is an instance of the class represented by the specified base id. */
  function __instanceof(ptr, baseId) {
    const U32 = new Uint32Array(memory.buffer);
    var id = U32[(ptr + ID_OFFSET) >>> 2];
    if (id <= U32[rttiBase >>> 2]) {
      do if (id == baseId) return true;
      while (id = getBase(id));
    }
    return false;
  }

  baseModule.__instanceof = __instanceof;

  // Pull basic exports to baseModule so code in preInstantiate can use them
  baseModule.memory = baseModule.memory || memory;
  baseModule.table  = baseModule.table  || table;

  // Demangle exports and provide the usual utility on the prototype
  return demangle(rawExports, baseModule);
}

/** Wraps a WebAssembly function while also taking care of variable arguments. */
function wrapFunction(fn, setargc) {
  var wrap = (...args) => {
    setargc(args.length);
    return fn(...args);
  }
  wrap.original = fn;
  return wrap;
}

function isResponse(o) {
  return typeof Response !== "undefined" && o instanceof Response;
}

/** Asynchronously instantiates an AssemblyScript module from anything that can be instantiated. */
async function instantiate(source, imports) {
  if (isResponse(source = await source)) return instantiateStreaming(source, imports);
  return postInstantiate(
    preInstantiate(imports || (imports = {})),
    await WebAssembly.instantiate(
      source instanceof WebAssembly.Module
        ? source
        : await WebAssembly.compile(source),
      imports
    )
  );
}

exports.instantiate = instantiate;

/** Synchronously instantiates an AssemblyScript module from a WebAssembly.Module or binary buffer. */
function instantiateSync(source, imports) {
  return postInstantiate(
    preInstantiate(imports || (imports = {})),
    new WebAssembly.Instance(
      source instanceof WebAssembly.Module
        ? source
        : new WebAssembly.Module(source),
      imports
    )
  )
}

exports.instantiateSync = instantiateSync;

/** Asynchronously instantiates an AssemblyScript module from a response, i.e. as obtained by `fetch`. */
async function instantiateStreaming(source, imports) {
  if (!WebAssembly.instantiateStreaming) {
    return instantiate(
      isResponse(source = await source)
        ? source.arrayBuffer()
        : source,
      imports
    );
  }
  return postInstantiate(
    preInstantiate(imports || (imports = {})),
    (await WebAssembly.instantiateStreaming(source, imports)).instance
  );
}

exports.instantiateStreaming = instantiateStreaming;

/** Demangles an AssemblyScript module's exports to a friendly object structure. */
function demangle(exports, baseModule) {
  var module = baseModule ? Object.create(baseModule) : {};
  var setargc = exports["__setargc"] || function() {};
  function hasOwnProperty(elem, prop) {
    return Object.prototype.hasOwnProperty.call(elem, prop);
  }
  for (let internalName in exports) {
    if (!hasOwnProperty(exports, internalName)) continue;
    let elem = exports[internalName];
    let parts = internalName.split(".");
    let curr = module;
    while (parts.length > 1) {
      let part = parts.shift();
      if (!hasOwnProperty(curr, part)) curr[part] = {};
      curr = curr[part];
    }
    let name = parts[0];
    let hash = name.indexOf("#");
    if (hash >= 0) {
      let className = name.substring(0, hash);
      let classElem = curr[className];
      if (typeof classElem === "undefined" || !classElem.prototype) {
        let ctor = function(...args) {
          return ctor.wrap(ctor.prototype.constructor(0, ...args));
        };
        ctor.prototype = {
          valueOf: function valueOf() {
            return this[THIS];
          }
        };
        ctor.wrap = function(thisValue) {
          return Object.create(ctor.prototype, { [THIS]: { value: thisValue, writable: false } });
        };
        if (classElem) Object.getOwnPropertyNames(classElem).forEach(name =>
          Object.defineProperty(ctor, name, Object.getOwnPropertyDescriptor(classElem, name))
        );
        curr[className] = ctor;
      }
      name = name.substring(hash + 1);
      curr = curr[className].prototype;
      if (/^(get|set):/.test(name)) {
        if (!hasOwnProperty(curr, name = name.substring(4))) {
          let getter = exports[internalName.replace("set:", "get:")];
          let setter = exports[internalName.replace("get:", "set:")];
          Object.defineProperty(curr, name, {
            get: function() { return getter(this[THIS]); },
            set: function(value) { setter(this[THIS], value); },
            enumerable: true
          });
        }
      } else {
        if (name === 'constructor') {
          curr[name] = wrapFunction(elem, setargc);
        } else { // for methods
          Object.defineProperty(curr, name, {
            value: function (...args) {
              setargc(args.length);
              return elem(this[THIS], ...args);
            }
          });
        }
      }
    } else {
      if (/^(get|set):/.test(name)) {
        if (!hasOwnProperty(curr, name = name.substring(4))) {
          Object.defineProperty(curr, name, {
            get: exports[internalName.replace("set:", "get:")],
            set: exports[internalName.replace("get:", "set:")],
            enumerable: true
          });
        }
      } else if (typeof elem === "function") {
        curr[name] = wrapFunction(elem, setargc);
      } else {
        curr[name] = elem;
      }
    }
  }

  return module;
}

exports.demangle = demangle;

},{}],"../node_modules/as2d/lib/glue/AS2DGlue.js":[function(require,module,exports) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var loader_1 = require("assemblyscript/lib/loader");
var CanvasPatternRepetitionValues = ["repeat", "repeat_x", "repeat_y", "no_repeat"];
var FillRuleValues = ["nonzero", "evenodd"];
var LineCapValues = ["butt", "round", "square"];
var LineJoinValues = ["bevel", "round", "miter"];
var TextBaselineValues = ["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"];
var TextAlignValues = ["left", "right", "center", "start", "end"];
var CanvasDirectionValues = ["ltr", "rtl", "inherit"];
var ImageSmoothingQualityValues = ["low", "medium", "high"];
var GlobalCompositeOperationValues = [
    "source-over",
    "source-in",
    "source-out",
    "source-atop",
    "destination-over",
    "destination-in",
    "destination-out",
    "destination-atop",
    "lighter",
    "copy",
    "xor",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity",
];
var bool = {
    "true": 1,
    "false": 0,
};
var AS2DGlue = /** @class */ (function () {
    function AS2DGlue() {
        this.imports = null;
        this.wasm = null;
        this.id = -1;
    }
    AS2DGlue.prototype.instantiateBuffer = function (buffer, imports) {
        this.imports = imports;
        this.hookImports();
        this.wasm = loader_1.instantiateSync(buffer, this.imports);
        this.hookWasmApi();
        return this.wasm;
    };
    AS2DGlue.prototype.instantiateStreaming = function (response, imports) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.imports = imports;
                        this.hookImports();
                        _a = this;
                        return [4 /*yield*/, loader_1.instantiateStreaming(response, this.imports)];
                    case 1:
                        _a.wasm = _b.sent();
                        this.hookWasmApi();
                        return [2 /*return*/, this.wasm];
                }
            });
        });
    };
    AS2DGlue.prototype.instantiate = function (module, imports) {
        this.imports = imports;
        this.hookImports();
        this.wasm = loader_1.instantiate(module, this.imports);
        this.hookWasmApi();
        return this.wasm;
    };
    AS2DGlue.prototype.hookImports = function () {
        this.imports.__canvas_sys = {
            addColorStop: this.addColorStop.bind(this),
            createLinearGradient: this.createLinearGradient.bind(this),
            createPattern: this.createPattern.bind(this),
            createRadialGradient: this.createRadialGradient.bind(this),
            disposeCanvasGradient: this.disposeCanvasGradient.bind(this),
            disposeCanvasPattern: this.disposeCanvasPattern.bind(this),
            disposeImage: this.disposeImage.bind(this),
            isPointInPath: this.isPointInPath.bind(this),
            isPointInStroke: this.isPointInStroke.bind(this),
            loadImage: this.loadImage.bind(this),
            measureText: this.measureText.bind(this),
            render: this.render.bind(this),
        };
    };
    AS2DGlue.prototype.hookWasmApi = function () {
        this.wasm.contexts = {};
        this.wasm.gradients = {};
        this.wasm.images = {};
        this.wasm.loading = {};
        this.wasm.patterns = {};
        this.wasm.useContext = this.useContext.bind(this);
    };
    AS2DGlue.prototype.useContext = function (name, ctx) {
        this.id += 1;
        this.wasm.contexts[this.id] = ctx;
        this.wasm.__use_context(this.wasm.__allocString(name), this.id);
        return this.id;
    };
    AS2DGlue.prototype.createLinearGradient = function (objid, x0, y0, x1, y1) {
        this.id += 1;
        if (!this.wasm.contexts[objid])
            throw new Error("Cannot find canvas: " + objid);
        this.wasm.gradients[this.id] = this.wasm.contexts[objid].createLinearGradient(x0, y0, x1, y1);
        return this.id;
    };
    AS2DGlue.prototype.createRadialGradient = function (objid, x0, y0, r0, x1, y1, r1) {
        this.id += 1;
        if (!this.wasm.contexts[objid])
            throw new Error("Cannot find canvas: " + objid);
        this.wasm.gradients[this.id] = this.wasm.contexts[objid].createRadialGradient(x0, y0, r0, x1, y1, r1);
        return this.id;
    };
    AS2DGlue.prototype.addColorStop = function (objid, offset, color) {
        if (!this.wasm.gradients[objid])
            throw new Error("Cannot find gradient: " + objid);
        this.wasm.gradients[objid].addColorStop(offset, this.wasm.__getString(color));
    };
    AS2DGlue.prototype.loadImage = function (imgPointer, srcPointer) {
        var _this = this;
        var src = this.wasm.__getString(srcPointer);
        this.id += 1;
        var result = this.id;
        this.wasm.loading[result] = fetch(src)
            .then(function (e) { return e.blob(); })
            .then(createImageBitmap)
            .then(function (e) {
            _this.wasm.__image_loaded(imgPointer, e.width, e.height);
            _this.wasm.images[result] = e;
            return e;
        });
        return this.id;
    };
    AS2DGlue.prototype.createPattern = function (cvsobjid, objid, repetition) {
        this.id += 1;
        if (!this.wasm.contexts[cvsobjid])
            throw new Error("Cannot find canvas: " + cvsobjid);
        if (!this.wasm.images[objid])
            throw new Error("Cannot find image: " + objid);
        this.wasm.patterns[this.id] = this.wasm.contexts[cvsobjid].createPattern(this.wasm.images[objid], CanvasPatternRepetitionValues[repetition].replace("_", "-"));
        return this.id;
    };
    AS2DGlue.prototype.measureText = function (cvsobjid, text) {
        // The canvas exists, because render was already called
        // if (!this.wasm!.contexts[cvsobjid]) throw new Error("Cannot find canvas: " + cvsobjid);
        var ctx = this.wasm.contexts[cvsobjid];
        return ctx.measureText(this.wasm.__getString(text)).width;
    };
    AS2DGlue.prototype.render = function (cvsobjid, pointer) {
        if (!this.wasm.contexts[cvsobjid])
            throw new Error("Cannot find canvas: " + cvsobjid);
        var wasm = this.wasm;
        var ctx = wasm.contexts[cvsobjid];
        var data = new Float64Array(wasm.memory.buffer, pointer, 0x10000);
        var i = 0;
        var strings = {};
        while (i < 0x10000 && data[i] !== 6 /* Commit */) {
            switch (data[i]) {
                case 0 /* Arc */: {
                    ctx.arc(data[i + 2], data[i + 3], data[i + 4], data[i + 5], data[i + 6], data[i + 7] === 1);
                    break;
                }
                case 1 /* ArcTo */: {
                    ctx.arcTo(data[i + 2], data[i + 3], data[i + 4], data[i + 5], data[i + 6]);
                    break;
                }
                case 2 /* BeginPath */: {
                    ctx.beginPath();
                    break;
                }
                case 3 /* BezierCurveTo */: {
                    ctx.bezierCurveTo(data[i + 2], data[i + 3], data[i + 4], data[i + 5], data[i + 6], data[i + 7]);
                    break;
                }
                case 4 /* Clip */: {
                    ctx.clip();
                    break;
                }
                case 5 /* ClosePath */: {
                    ctx.closePath();
                    break;
                }
                case 7 /* ClearRect */: {
                    ctx.clearRect(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                    break;
                }
                case 8 /* Direction */: {
                    ctx.direction = CanvasDirectionValues[data[i + 2]];
                    break;
                }
                case 10 /* DrawImage */: {
                    ctx.drawImage(wasm.images[data[i + 2]], data[i + 3], data[i + 4], data[i + 5], data[i + 6], data[i + 7], data[i + 8], data[i + 9], data[i + 10]);
                    break;
                }
                case 11 /* Ellipse */: {
                    ctx.ellipse(data[i + 2], data[i + 3], data[i + 4], data[i + 5], data[i + 6], data[i + 7], data[i + 8], data[i + 9] === 1);
                    break;
                }
                case 12 /* Fill */: {
                    ctx.fill(FillRuleValues[data[i + 2]]);
                    break;
                }
                case 13 /* FillGradient */: {
                    ctx.fillStyle = wasm.gradients[data[i + 2]];
                    break;
                }
                case 14 /* FillPattern */: {
                    ctx.fillStyle = wasm.patterns[data[i + 2]];
                    break;
                }
                case 15 /* FillRect */: {
                    ctx.fillRect(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                    break;
                }
                case 16 /* FillStyle */: {
                    ctx.fillStyle = strings[data[i + 2]] || (strings[data[i + 2]] = wasm.__getString(data[i + 2]));
                    break;
                }
                case 17 /* FillText */: {
                    ctx.fillText(strings[data[i + 2]] || (strings[data[i + 2]] = wasm.__getString(data[i + 2])), data[i + 3], data[i + 4]);
                    break;
                }
                case 18 /* FillTextWidth */: {
                    ctx.fillText(strings[data[i + 2]] || (strings[data[i + 2]] = wasm.__getString(data[i + 2])), data[i + 3], data[i + 4], data[i + 5]);
                    break;
                }
                case 19 /* Filter */: {
                    ctx.filter = strings[data[i + 2]] || (strings[data[i + 2]] = wasm.__getString(data[i + 2]));
                    break;
                }
                case 20 /* Font */: {
                    ctx.font = strings[data[i + 2]] || (strings[data[i + 2]] = wasm.__getString(data[i + 2]));
                    break;
                }
                case 21 /* GlobalAlpha */: {
                    ctx.globalAlpha = data[i + 2];
                    break;
                }
                case 22 /* GlobalCompositeOperation */: {
                    ctx.globalCompositeOperation = GlobalCompositeOperationValues[data[i + 2]];
                    break;
                }
                case 23 /* ImageSmoothingEnabled */: {
                    ctx.imageSmoothingEnabled = data[i + 1] === 1;
                    break;
                }
                case 24 /* ImageSmoothingQuality */: {
                    ctx.imageSmoothingQuality = ImageSmoothingQualityValues[data[i + 2]];
                    break;
                }
                case 26 /* LineCap */: {
                    ctx.lineCap = LineCapValues[data[i + 2]];
                    break;
                }
                case 27 /* LineDash */: {
                    // @ts-ignore setLineDash accepts a Float64Array as a parameter
                    ctx.setLineDash(wasm.__getFloat64Array(data[i + 2]));
                    break;
                }
                case 28 /* LineDashOffset */: {
                    ctx.lineDashOffset = data[i + 2];
                    break;
                }
                case 29 /* LineJoin */: {
                    ctx.lineJoin = LineJoinValues[data[i + 2]];
                    break;
                }
                case 30 /* LineTo */: {
                    ctx.lineTo(data[i + 2], data[i + 3]);
                    break;
                }
                case 31 /* LineWidth */: {
                    ctx.lineWidth = data[i + 2];
                    break;
                }
                case 32 /* MiterLimit */: {
                    ctx.miterLimit = data[i + 2];
                    break;
                }
                case 33 /* MoveTo */: {
                    ctx.moveTo(data[i + 2], data[i + 3]);
                    break;
                }
                case 34 /* QuadraticCurveTo */: {
                    ctx.quadraticCurveTo(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                    break;
                }
                case 35 /* Rect */: {
                    ctx.rect(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                    break;
                }
                case 36 /* Restore */: {
                    ctx.restore();
                    break;
                }
                case 38 /* Save */: {
                    ctx.save();
                    break;
                }
                case 40 /* SetTransform */: {
                    ctx.setTransform(data[i + 2], data[i + 3], data[i + 4], data[i + 5], data[i + 6], data[i + 7]);
                    break;
                }
                case 41 /* ShadowBlur */: {
                    ctx.shadowBlur = data[i + 2];
                    break;
                }
                case 42 /* ShadowColor */: {
                    ctx.shadowColor = strings[data[i + 2]] || (strings[data[i + 2]] = wasm.__getString(data[i + 2]));
                    break;
                }
                case 43 /* ShadowOffsetX */: {
                    ctx.shadowOffsetX = data[i + 2];
                    break;
                }
                case 44 /* ShadowOffsetY */: {
                    ctx.shadowOffsetY = data[i + 2];
                    break;
                }
                case 45 /* Stroke */: {
                    ctx.stroke();
                    break;
                }
                case 46 /* StrokeGradient */: {
                    ctx.strokeStyle = wasm.gradients[data[i + 2]];
                    break;
                }
                case 47 /* StrokePattern */: {
                    ctx.strokeStyle = wasm.patterns[data[i + 2]];
                    break;
                }
                case 48 /* StrokeRect */: {
                    ctx.strokeRect(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                    break;
                }
                case 49 /* StrokeStyle */: {
                    ctx.strokeStyle = strings[data[i + 2]] || (strings[data[i + 2]] = wasm.__getString(data[i + 2]));
                    break;
                }
                case 50 /* StrokeText */: {
                    ctx.strokeText(strings[data[i + 2]] || (strings[data[i + 2]] = wasm.__getString(data[i + 2])), data[i + 3], data[i + 4]);
                    break;
                }
                case 51 /* StrokeTextWidth */: {
                    ctx.strokeText(strings[data[i + 2]] || (strings[data[i + 2]] = wasm.__getString(data[i + 2])), data[i + 3], data[i + 4], data[i + 5]);
                    break;
                }
                case 52 /* TextAlign */: {
                    ctx.textAlign = TextAlignValues[data[i + 2]];
                    break;
                }
                case 53 /* TextBaseline */: {
                    ctx.textBaseline = TextBaselineValues[data[i + 2]];
                    break;
                }
            }
            i = data[i + 1];
        }
    };
    AS2DGlue.prototype.disposeCanvasPattern = function (id) {
        delete this.wasm.patterns[id];
    };
    AS2DGlue.prototype.disposeImage = function (id) {
        delete this.wasm.images[id];
    };
    AS2DGlue.prototype.disposeCanvasGradient = function (id) {
        delete this.wasm.gradients[id];
    };
    AS2DGlue.prototype.isPointInPath = function (id, x, y, fillRule) {
        return bool[this.wasm.contexts[id].isPointInPath(x, y, FillRuleValues[fillRule]).toString()];
    };
    AS2DGlue.prototype.isPointInStroke = function (id, x, y) {
        return bool[this.wasm.contexts[id].isPointInStroke(x, y).toString()];
    };
    return AS2DGlue;
}());
exports.AS2DGlue = AS2DGlue;

},{"assemblyscript/lib/loader":"../node_modules/assemblyscript/lib/loader/index.js"}],"../node_modules/as2d/lib/shared/CanvasDirection.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The CanvasRenderingContext2D.direction value of the Canvas 2D API specifies the current text
 * direction used to draw text onto the canvas.
 */
var CanvasDirection;
(function (CanvasDirection) {
    /**
     * The text direction is left-to-right.
     */
    CanvasDirection[CanvasDirection["ltr"] = 0] = "ltr";
    /**
     * The text direction is right-to-left.
     */
    CanvasDirection[CanvasDirection["rtl"] = 1] = "rtl";
    /**
     * The text direction is inherited from the <canvas> element or the Document as appropriate. Default value.
     */
    CanvasDirection[CanvasDirection["inherit"] = 2] = "inherit";
})(CanvasDirection = exports.CanvasDirection || (exports.CanvasDirection = {}));

},{}],"../node_modules/as2d/lib/shared/CanvasInstruction.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],"../node_modules/as2d/lib/shared/CanvasPatternRepetition.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A value indicating how to repeat the pattern's image.
 */
var CanvasPatternRepetition;
(function (CanvasPatternRepetition) {
    /**
     * A canvas pattern repetition indicating a repeating pattern in both the x and y directions.
     */
    CanvasPatternRepetition[CanvasPatternRepetition["repeat"] = 0] = "repeat";
    /**
     * A canvas pattern repetition indicating a repeating pattern only the x direction.
     */
    CanvasPatternRepetition[CanvasPatternRepetition["repeat_x"] = 1] = "repeat_x";
    /**
     * A canvas pattern repetition indicating a repeating pattern only the y direction.
     */
    CanvasPatternRepetition[CanvasPatternRepetition["repeat_y"] = 2] = "repeat_y";
    /**
     * A canvas pattern repetition indicationg no repeating pattern.
     */
    CanvasPatternRepetition[CanvasPatternRepetition["no_repeat"] = 3] = "no_repeat";
})(CanvasPatternRepetition = exports.CanvasPatternRepetition || (exports.CanvasPatternRepetition = {}));

},{}],"../node_modules/as2d/lib/shared/FillRule.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FillRule;
(function (FillRule) {
    FillRule[FillRule["nonzero"] = 0] = "nonzero";
    FillRule[FillRule["evenodd"] = 1] = "evenodd";
})(FillRule = exports.FillRule || (exports.FillRule = {}));

},{}],"../node_modules/as2d/lib/shared/GlobalCompositeOperation.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The GlobalCompositeOperation enum for the globalCompositeOperation property sets the type
 * of compositing operation to apply when drawing new shapes.
 */
var GlobalCompositeOperation;
(function (GlobalCompositeOperation) {
    /**
     * This is the default setting and draws new shapes on top of the existing canvas content
     */
    GlobalCompositeOperation[GlobalCompositeOperation["source_over"] = 0] = "source_over";
    /**
     * The new shape is drawn only where both the new shape and the destination canvas overlap.
     * Everything else is made transparent.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["source_in"] = 1] = "source_in";
    /**
     * The new shape is drawn where it doesn't overlap the existing canvas content.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["source_out"] = 2] = "source_out";
    /**
     * The new shape is only drawn where it overlaps the existing canvas content.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["source_atop"] = 3] = "source_atop";
    /**
     * New shapes are drawn behind the existing canvas content.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["destination_over"] = 4] = "destination_over";
    /**
     * The existing canvas content is kept where both the new shape and existing canvas content
     * overlap. Everything else is made transparent.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["destination_in"] = 5] = "destination_in";
    /**
     * The existing content is kept where it doesn't overlap the new shape.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["destination_out"] = 6] = "destination_out";
    /**
     * The existing canvas is only kept where it overlaps the new shape. The new shape is drawn
     * behind the canvas content.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["destination_atop"] = 7] = "destination_atop";
    /**
     * Where both shapes overlap the color is determined by adding color values.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["lighter"] = 8] = "lighter";
    /**
     * Only the new shape is shown.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["copy"] = 9] = "copy";
    /**
     * Shapes are made transparent where both overlap and drawn normal everywhere else.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["xor"] = 10] = "xor";
    /**
     * The pixels are of the top layer are multiplied with the corresponding pixel of the bottom
     * layer. A darker picture is the result.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["multiply"] = 11] = "multiply";
    /**
     * The pixels are inverted, multiplied, and inverted again. A lighter picture is the result
     * (opposite of multiply)
     */
    GlobalCompositeOperation[GlobalCompositeOperation["screen"] = 12] = "screen";
    /**
     * A combination of multiply and screen. Dark parts on the base layer become darker, and light
     * parts become lighter.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["overlay"] = 13] = "overlay";
    /**
     * Retains the darkest pixels of both layers.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["darken"] = 14] = "darken";
    /**
     * Retains the lightest pixels of both layers.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["lighten"] = 15] = "lighten";
    /**
     * Divides the bottom layer by the inverted top layer.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["color_dodge"] = 16] = "color_dodge";
    /**
     * Divides the inverted bottom layer by the top layer, and then inverts the result.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["color_burn"] = 17] = "color_burn";
    /**
     * A combination of multiply and screen like overlay, but with top and bottom layer swapped.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["hard_light"] = 18] = "hard_light";
    /**
     * A softer version of hard-light. Pure black or white does not result in pure black or white.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["soft_light"] = 19] = "soft_light";
    /**
     * Subtracts the bottom layer from the top layer or the other way round to always get a positive
     * value.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["difference"] = 20] = "difference";
    /**
     * Like difference, but with lower contrast.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["exclusion"] = 21] = "exclusion";
    /**
     * Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["hue"] = 22] = "hue";
    /**
     * Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["saturation"] = 23] = "saturation";
    /**
     * Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["color"] = 24] = "color";
    /**
     * Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.
     */
    GlobalCompositeOperation[GlobalCompositeOperation["luminosity"] = 25] = "luminosity";
})(GlobalCompositeOperation = exports.GlobalCompositeOperation || (exports.GlobalCompositeOperation = {}));

},{}],"../node_modules/as2d/lib/shared/GlobalCompositeOperationValue.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The GlobalCompositeOperation enum for the globalCompositeOperation property sets the type
 * of compositing operation to apply when drawing new shapes.
 */
var GlobalCompositeOperationValue;
(function (GlobalCompositeOperationValue) {
    /**
     * This is the default setting and draws new shapes on top of the existing canvas content
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["source-over"] = 0] = "source-over";
    /**
     * The new shape is drawn only where both the new shape and the destination canvas overlap.
     * Everything else is made transparent.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["source-in"] = 1] = "source-in";
    /**
     * The new shape is drawn where it doesn't overlap the existing canvas content.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["source-out"] = 2] = "source-out";
    /**
     * The new shape is only drawn where it overlaps the existing canvas content.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["source-atop"] = 3] = "source-atop";
    /**
     * New shapes are drawn behind the existing canvas content.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["destination-over"] = 4] = "destination-over";
    /**
     * The existing canvas content is kept where both the new shape and existing canvas content
     * overlap. Everything else is made transparent.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["destination-in"] = 5] = "destination-in";
    /**
     * The existing content is kept where it doesn't overlap the new shape.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["destination-out"] = 6] = "destination-out";
    /**
     * The existing canvas is only kept where it overlaps the new shape. The new shape is drawn
     * behind the canvas content.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["destination-atop"] = 7] = "destination-atop";
    /**
     * Where both shapes overlap the color is determined by adding color values.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["lighter"] = 8] = "lighter";
    /**
     * Only the new shape is shown.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["copy"] = 9] = "copy";
    /**
     * Shapes are made transparent where both overlap and drawn normal everywhere else.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["xor"] = 10] = "xor";
    /**
     * The pixels are of the top layer are multiplied with the corresponding pixel of the bottom
     * layer. A darker picture is the result.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["multiply"] = 11] = "multiply";
    /**
     * The pixels are inverted, multiplied, and inverted again. A lighter picture is the result
     * (opposite of multiply)
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["screen"] = 12] = "screen";
    /**
     * A combination of multiply and screen. Dark parts on the base layer become darker, and light
     * parts become lighter.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["overlay"] = 13] = "overlay";
    /**
     * Retains the darkest pixels of both layers.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["darken"] = 14] = "darken";
    /**
     * Retains the lightest pixels of both layers.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["lighten"] = 15] = "lighten";
    /**
     * Divides the bottom layer by the inverted top layer.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["color-dodge"] = 16] = "color-dodge";
    /**
     * Divides the inverted bottom layer by the top layer, and then inverts the result.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["color-burn"] = 17] = "color-burn";
    /**
     * A combination of multiply and screen like overlay, but with top and bottom layer swapped.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["hard-light"] = 18] = "hard-light";
    /**
     * A softer version of hard-light. Pure black or white does not result in pure black or white.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["soft-light"] = 19] = "soft-light";
    /**
     * Subtracts the bottom layer from the top layer or the other way round to always get a positive
     * value.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["difference"] = 20] = "difference";
    /**
     * Like difference, but with lower contrast.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["exclusion"] = 21] = "exclusion";
    /**
     * Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["hue"] = 22] = "hue";
    /**
     * Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["saturation"] = 23] = "saturation";
    /**
     * Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["color"] = 24] = "color";
    /**
     * Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.
     */
    GlobalCompositeOperationValue[GlobalCompositeOperationValue["luminosity"] = 25] = "luminosity";
})(GlobalCompositeOperationValue = exports.GlobalCompositeOperationValue || (exports.GlobalCompositeOperationValue = {}));

},{}],"../node_modules/as2d/lib/shared/ImageSmoothingQuality.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImageSmoothingQuality;
(function (ImageSmoothingQuality) {
    ImageSmoothingQuality[ImageSmoothingQuality["low"] = 0] = "low";
    ImageSmoothingQuality[ImageSmoothingQuality["medium"] = 1] = "medium";
    ImageSmoothingQuality[ImageSmoothingQuality["high"] = 2] = "high";
})(ImageSmoothingQuality = exports.ImageSmoothingQuality || (exports.ImageSmoothingQuality = {}));

},{}],"../node_modules/as2d/lib/shared/LineCap.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LineCap;
(function (LineCap) {
    LineCap[LineCap["butt"] = 0] = "butt";
    LineCap[LineCap["round"] = 1] = "round";
    LineCap[LineCap["square"] = 2] = "square";
})(LineCap = exports.LineCap || (exports.LineCap = {}));

},{}],"../node_modules/as2d/lib/shared/LineJoin.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The LineJoin enum responsible for setting the lineJoin property of the Canvas 2D API determines
 * the shape used to join two line segments where they meet.
 *
 * This property has no effect wherever two connected segments have the same direction, because no
 * joining area will be added in this case. Degenerate segments with a length of zero (i.e., with
 * all endpoints and control points at the exact same position) are also ignored.
 */
var LineJoin;
(function (LineJoin) {
    /**
     * Rounds off the corners of a shape by filling an additional sector of disc centered at the
     * common endpoint of connected segments. The radius for these rounded corners is equal to the
     * line width.
     */
    LineJoin[LineJoin["bevel"] = 0] = "bevel";
    /**
     * Fills an additional triangular area between the common endpoint of connected segments, and the
     * separate outside rectangular corners of each segment.
     */
    LineJoin[LineJoin["round"] = 1] = "round";
    /**
     * Connected segments are joined by extending their outside edges to connect at a single point,
     * with the effect of filling an additional lozenge-shaped area. This setting is affected by the
     * miterLimit property. Default value.
     */
    LineJoin[LineJoin["miter"] = 2] = "miter";
})(LineJoin = exports.LineJoin || (exports.LineJoin = {}));

},{}],"../node_modules/as2d/lib/shared/TextAlign.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The TextAlign enum specifies the current text alignment used when drawing text.
 *
 * The alignment is relative to the x value of the fillText() method. For example, if textAlign is
 * "center", then the text's left edge will be at x - (textWidth / 2).
 */
var TextAlign;
(function (TextAlign) {
    /**
     * The text is left-aligned.
     **/
    TextAlign[TextAlign["left"] = 0] = "left";
    /**
     * The text is right-aligned.
     **/
    TextAlign[TextAlign["right"] = 1] = "right";
    /**
     * The text is centered.
     **/
    TextAlign[TextAlign["center"] = 2] = "center";
    /**
     * The text is aligned at the normal start of the line (left-aligned for left-to-right locales, right-aligned for right-to-left locales).
     **/
    TextAlign[TextAlign["start"] = 3] = "start";
    /**
     * The text is aligned at the normal end of the line (right-aligned for left-to-right locales, left-aligned for right-to-left locales).
     **/
    TextAlign[TextAlign["end"] = 4] = "end";
})(TextAlign = exports.TextAlign || (exports.TextAlign = {}));

},{}],"../node_modules/as2d/lib/shared/TextBaseline.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The TextBasline enum specifies the current text baseline used when drawing text.
 */
var TextBaseline;
(function (TextBaseline) {
    /**
     * The text baseline is the top of the em square.
     **/
    TextBaseline[TextBaseline["top"] = 0] = "top";
    /**
     * The text baseline is the hanging baseline. (Used by Tibetan and other Indic scripts.)
     **/
    TextBaseline[TextBaseline["hanging"] = 1] = "hanging";
    /**
     * The text baseline is the middle of the em square.
     **/
    TextBaseline[TextBaseline["middle"] = 2] = "middle";
    /**
     * The text baseline is the normal alphabetic baseline. Default value.
     **/
    TextBaseline[TextBaseline["alphabetic"] = 3] = "alphabetic";
    /**
     * The text baseline is the ideographic baseline; this is the bottom of the body of the characters, if the main body of characters protrudes beneath the alphabetic baseline. (Used by Chinese, Japanese, and Korean scripts.)
     **/
    TextBaseline[TextBaseline["ideographic"] = 4] = "ideographic";
    /**
     * The text baseline is the bottom of the bounding box. This differs from the ideographic baseline in that the ideographic baseline doesn't consider descenders.
     **/
    TextBaseline[TextBaseline["bottom"] = 5] = "bottom";
})(TextBaseline = exports.TextBaseline || (exports.TextBaseline = {}));

},{}],"../node_modules/as2d/lib/index.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var AS2DGlue_1 = require("./glue/AS2DGlue");
function instantiateBuffer(buffer, imports) {
    if (imports === void 0) { imports = {}; }
    var glue = new AS2DGlue_1.AS2DGlue();
    return glue.instantiateBuffer(buffer, imports);
}
exports.instantiateBuffer = instantiateBuffer;
function instantiate(mod, imports) {
    if (imports === void 0) { imports = {}; }
    var glue = new AS2DGlue_1.AS2DGlue();
    return glue.instantiate(mod, imports);
}
exports.instantiate = instantiate;
function instantiateStreaming(response, imports) {
    if (imports === void 0) { imports = {}; }
    var glue = new AS2DGlue_1.AS2DGlue();
    return glue.instantiateStreaming(response, imports);
}
exports.instantiateStreaming = instantiateStreaming;
__export(require("./glue/AS2DGlue"));
__export(require("./shared/CanvasDirection"));
__export(require("./shared/CanvasInstruction"));
__export(require("./shared/CanvasPatternRepetition"));
__export(require("./shared/FillRule"));
__export(require("./shared/GlobalCompositeOperation"));
__export(require("./shared/GlobalCompositeOperationValue"));
__export(require("./shared/ImageSmoothingQuality"));
__export(require("./shared/LineCap"));
__export(require("./shared/LineJoin"));
__export(require("./shared/TextAlign"));
__export(require("./shared/TextBaseline"));

},{"./glue/AS2DGlue":"../node_modules/as2d/lib/glue/AS2DGlue.js","./shared/CanvasDirection":"../node_modules/as2d/lib/shared/CanvasDirection.js","./shared/CanvasInstruction":"../node_modules/as2d/lib/shared/CanvasInstruction.js","./shared/CanvasPatternRepetition":"../node_modules/as2d/lib/shared/CanvasPatternRepetition.js","./shared/FillRule":"../node_modules/as2d/lib/shared/FillRule.js","./shared/GlobalCompositeOperation":"../node_modules/as2d/lib/shared/GlobalCompositeOperation.js","./shared/GlobalCompositeOperationValue":"../node_modules/as2d/lib/shared/GlobalCompositeOperationValue.js","./shared/ImageSmoothingQuality":"../node_modules/as2d/lib/shared/ImageSmoothingQuality.js","./shared/LineCap":"../node_modules/as2d/lib/shared/LineCap.js","./shared/LineJoin":"../node_modules/as2d/lib/shared/LineJoin.js","./shared/TextAlign":"../node_modules/as2d/lib/shared/TextAlign.js","./shared/TextBaseline":"../node_modules/as2d/lib/shared/TextBaseline.js"}],"../node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"index.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var as2d_1 = require("as2d");

var fs = require("fs");

var buffer = Buffer("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aiIBIARBEGtBAXI2AgAgACABEAQFIAEgA0F+cTYCACABQRBqIAEoAgBBfHFqIAFBEGogASgCAEF8cWooAgBBfXE2AgALC5EBAQJ/IwEEQEEAQRhB5gNBDRAAAAsgACABEAciAxAIIgJFBEBBASQBEA5BACQBIAAgAxAIIgJFBEAgACADEA8gACADEAgiAkUEQEEAQRhB8gNBExAAAAsLCyACKAIAQXxxIANJBEBBAEEYQfoDQQ0QAAALIAJBADYCBCACIAE2AgwgACACEAMgACACIAMQECACCyIBAX8jACICBH8gAgUQBiMACyAAEBEiACABNgIIIABBEGoLUQEBfyAAKAIEIgFBgICAgH9xIAFBAWpBgICAgH9xRwRAQQBBgAFB6ABBAhAAAAsgACABQQFqNgIEIAAoAgBBAXEEQEEAQYABQesAQQ0QAAALCxQAIABB1AxLBEAgAEEQaxATCyAACycAIABB+AsoAgBLBEBBsAFB6AFBFkEbEAAACyAAQQN0QfwLaigCAAvEDAEDfwNAIAFBA3FBACACGwRAIAAiA0EBaiEAIAEiBEEBaiEBIAMgBC0AADoAACACQQFrIQIMAQsLIABBA3FFBEADQCACQRBJRQRAIAAgASgCADYCACAAQQRqIAFBBGooAgA2AgAgAEEIaiABQQhqKAIANgIAIABBDGogAUEMaigCADYCACABQRBqIQEgAEEQaiEAIAJBEGshAgwBCwsgAkEIcQRAIAAgASgCADYCACAAQQRqIAFBBGooAgA2AgAgAUEIaiEBIABBCGohAAsgAkEEcQRAIAAgASgCADYCACABQQRqIQEgAEEEaiEACyACQQJxBEAgACABLwEAOwEAIAFBAmohASAAQQJqIQALIAJBAXEEQCAAIAEtAAA6AAALDwsgAkEgTwRAAkACQAJAIABBA3EiA0EBRwRAIANBAkYNASADQQNGDQIMAwsgASgCACEFIAAgAS0AADoAACAAQQFqIgAgAUEBaiIBLQAAOgAAIABBAWoiA0EBaiEAIAFBAWoiBEEBaiEBIAMgBC0AADoAACACQQNrIQIDQCACQRFJRQRAIAAgAUEBaigCACIDQQh0IAVBGHZyNgIAIABBBGogA0EYdiABQQVqKAIAIgNBCHRyNgIAIABBCGogA0EYdiABQQlqKAIAIgNBCHRyNgIAIABBDGog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axAbCwuoAwIBfwF+AkAgAkUNACAAIAE6AAAgACACakEBayABOgAAIAJBAk0NACAAQQFqIAE6AAAgAEECaiABOgAAIAAgAmoiA0ECayABOgAAIANBA2sgAToAACACQQZNDQAgAEEDaiABOgAAIAAgAmpBBGsgAToAACACQQhNDQAgAkEAIABrQQNxIgJrIQMgACACaiICIAFB/wFxQYGChAhsIgA2AgAgA0F8cSIDIAJqQQRrIAA2AgAgA0EITQ0AIAJBBGogADYCACACQQhqIAA2AgAgAiADaiIBQQxrIAA2AgAgAUEIayAANgIAIANBGE0NACACQQxqIAA2AgAgAkEQaiAANgIAIAJBFGogADYCACACQRhqIAA2AgAgAiADaiIBQRxrIAA2AgAgAUEYayAANgIAIAFBFGsgADYCACABQRBrIAA2AgAgAiACQQRxQRhqIgJqIQEgAyACayECIACtIgQgBEIghoQhBANAIAJBIElFBEAgASAENwMAIAFBCGogBDcDACABQRBqIAQ3AwAgAUEYaiAENwMAIAJBIGshAiABQSBqIQEMAQsLCwuBAQECfyABQf7//z9LBEBBoANB0ANBF0E4EAAACyABQQN0IgJBABASIgFBACACEB0gAEUEQEEMQQIQEhAUIQALIABBADYCACAAQQA2AgQgAEEANgIIIAEgACgCACIDRwRAIAEQFBogAxAcCyAAIAE2AgAgACABNgIEIAAgAjYCCCAACw4AQQxBAxASEBQgABAeCy8BAX8gAEHw////A0sEQEGgA0HQA0E2QSoQAAALIABBABASIgFBACAAEB0gARAUC0gBAX9BEBAgIQEgACgCABAcIAAgATYCACAAQQM2AgRBMBAgIQEgACgCCBAcIAAgATYCCCAAQQQ2AgwgAEEANgIQIABBADYCFAs8AQF/QRhBCRASEBQiAEEANgIAIABBADYCBCAAQQA2AgggAEEANgIMIABBADYCECAAQQA2AhQgABAhIAALNQAgAEH1863pBmoiACAAQQ92cyAAQQFybCIAIABBPXIgAEEHdiAAc2wgAGpzIgAgAEEOdnMLpQEBAX5BASQLIABCIYggAIVCzZnW6v7666h/fiIBIAFCIYiFQtPYl9Thv67nRH4iASABQiGIhSQMIwxCf4UiASABQiGIhULNmdbq/vrrqH9+IgEgAUIh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", "base64");

function streaming() {
  return __awaiter(this, void 0, Promise, function () {
    var blob, url, _a;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          blob = new Blob([buffer], {
            type: "application/wasm"
          });
          url = URL.createObjectURL(blob); // @ts-ignore

          _a = window;
          return [4
          /*yield*/
          , as2d_1.instantiateStreaming(fetch(url), {})];

        case 1:
          // @ts-ignore
          _a.wasm = _b.sent();
          return [2
          /*return*/
          ];
      }
    });
  });
} // @ts-ignore


if (typeof WebAssembly.instantiateStreaming === "function") {
  streaming().then(postInstantiate);
} else {
  // @ts-ignore
  window.wasm = as2d_1.instantiateBuffer(buffer, {});
  postInstantiate();
}

function postInstantiate() {
  // @ts-ignore
  var wasm = window.wasm;
  var canvas = document.querySelector("canvas");

  if (canvas) {
    canvas.parentElement.removeChild(canvas);
  }

  var ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = 800;
  ctx.canvas.height = 600;
  ctx.canvas.style.border = "solid 1px black";
  ctx.canvas.addEventListener("mousemove", function (e) {
    var rect = e.target.getBoundingClientRect();
    wasm.mouseMove(e.clientX - rect.left, e.clientY - rect.top);
  });
  document.body.appendChild(ctx.canvas);
  wasm.useContext("main", ctx);
  wasm.init();
}
},{"as2d":"../node_modules/as2d/lib/index.js","fs":"../node_modules/parcel-bundler/src/builtins/_empty.js"}],"index.js":[function(require,module,exports) {
if (!window.frame) {
  window.frame = function frame() {
    requestAnimationFrame(frame);

    if (window.wasm) {
      window.wasm.update();
    }
  };

  requestAnimationFrame(window.frame);
}

if (!window.Buffer) window.Buffer = require("buffer").Buffer;

require("./index.ts");
},{"buffer":"../node_modules/buffer/index.js","./index.ts":"index.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53078" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map