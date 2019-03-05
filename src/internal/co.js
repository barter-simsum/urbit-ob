// ++  co
//
// See arvo/sys/hoon.hoon.

const BN = require('bn.js')
const lodash = require('lodash')

const ob = require('./ob')

const zero = new BN(0)
const one = new BN(1)
const two = new BN(2)
const three = new BN(3)
const four = new BN(4)
const five = new BN(5)

const pre = `
dozmarbinwansamlitsighidfidlissogdirwacsabwissib\
rigsoldopmodfoglidhopdardorlorhodfolrintogsilmir\
holpaslacrovlivdalsatlibtabhanticpidtorbolfosdot\
losdilforpilramtirwintadbicdifrocwidbisdasmidlop\
rilnardapmolsanlocnovsitnidtipsicropwitnatpanmin\
ritpodmottamtolsavposnapnopsomfinfonbanmorworsip\
ronnorbotwicsocwatdolmagpicdavbidbaltimtasmallig\
sivtagpadsaldivdactansidfabtarmonranniswolmispal\
lasdismaprabtobrollatlonnodnavfignomnibpagsopral\
bilhaddocridmocpacravripfaltodtiltinhapmicfanpat\
taclabmogsimsonpinlomrictapfirhasbosbatpochactid\
havsaplindibhosdabbitbarracparloddosbortochilmac\
tomdigfilfasmithobharmighinradmashalraglagfadtop\
mophabnilnosmilfopfamdatnoldinhatnacrisfotribhoc\
nimlarfitwalrapsarnalmoslandondanladdovrivbacpol\
laptalpitnambonrostonfodponsovnocsorlavmatmipfip\
`

const suf = `
zodnecbudwessevpersutletfulpensytdurwepserwylsun\
rypsyxdyrnuphebpeglupdepdysputlughecryttyvsydnex\
lunmeplutseppesdelsulpedtemledtulmetwenbynhexfeb\
pyldulhetmevruttylwydtepbesdexsefwycburderneppur\
rysrebdennutsubpetrulsynregtydsupsemwynrecmegnet\
secmulnymtevwebsummutnyxrextebfushepbenmuswyxsym\
selrucdecwexsyrwetdylmynmesdetbetbeltuxtugmyrpel\
syptermebsetdutdegtexsurfeltudnuxruxrenwytnubmed\
lytdusnebrumtynseglyxpunresredfunrevrefmectedrus\
bexlebduxrynnumpyxrygryxfeptyrtustyclegnemfermer\
tenlusnussyltecmexpubrymtucfyllepdebbermughuttun\
bylsudpemdevlurdefbusbeprunmelpexdytbyttyplevmyl\
wedducfurfexnulluclennerlexrupnedlecrydlydfenwel\
nydhusrelrudneshesfetdesretdunlernyrsebhulryllud\
remlysfynwerrycsugnysnyllyndyndemluxfedsedbecmun\
lyrtesmudnytbyrsenwegfyrmurtelreptegpecnelnevfes\
`

const patp2syls = name =>
  name.replace(/[\^~-]/g,'').match(/.{1,3}/g)

const splitAt = (index, str) => [str.slice(0, index), str.slice(index)]

const prefixes = pre.match(/.{1,3}/g)

const suffixes = suf.match(/.{1,3}/g)

const bex = (n) =>
  two.pow(n)

const lsh = (a, b, c) =>
  bex(bex(a).mul(b)).mul(c)

const rsh = (a, b, c) =>
  c.div(bex(bex(a).mul(b)))

const met = (a, b, c = zero) =>
  b.eq(zero)
  ? c
  : met(a, rsh(a, one, b), c.add(one))

const end = (a, b, c) =>
  c.mod(bex(bex(a).mul(b)))

/**
 * Convert a number to a @p-encoded string.
 *
 * @param  {String, Number, BN}  arg
 * @return  {String}
 */
const patp = (arg) => {
  const n = new BN(arg)

  const sxz = ob.feen(n)
  const dyy = met(four, sxz)

  const loop = (tsxz, timp, trep) => {
    const log = end(four, one, tsxz)
    const pre = prefixes[rsh(three, one, log)]
    const suf = suffixes[end(three, one, log)]
    const etc =
      (timp.mod(four)).eq(zero)
        ? timp.eq(zero)
          ? ''
          : '--'
        : '-'

    const res = pre + suf + etc + trep

    return timp.eq(dyy)
      ? trep
      : loop(rsh(four, one, tsxz), timp.add(one), res)
  }

  const dyx = met(three, sxz)

  return '~' +
    (dyx.lte(one)
    ? suffixes[sxz]
    : loop(sxz, zero, ''))
}

/**
 * Convert a hex-encoded string to a @p-encoded string.
 *
 * @param  {String}  hex
 * @return  {String}
 */
const hex2patp = (hex) =>
  patp(new BN(hex, 'hex'))

/**
 * Convert a Buffer to a @p-encoded string.
 *
 * @param  {Buffer}  buf
 * @return  {String}
 */
const buf2patp = (buf) =>
  hex2patp(buf.toString('hex'))

/**
 * Convert a @p-encoded string to a hex-encoded string.
 *
 * @param  {String}  name @p
 * @return  {String}
 */
const patp2hex = (name) => {
  if (isValidPat(name) === false) {
    throw new Error('patp2hex: not a valid @p')
  }
  const syls = patp2syls(name)

  const syl2bin = idx =>
    idx.toString(2).padStart(8, '0')

  const addr = lodash.reduce(syls, (acc, syl, idx) =>
    idx % 2 !== 0 || syls.length === 1
      ? acc + syl2bin(suffixes.indexOf(syl))
      : acc + syl2bin(prefixes.indexOf(syl)),
  '')

  const bn = new BN(addr, 2)
  const hex = ob.fend(bn).toString('hex')
  return hex.length % 2 !== 0
    ? hex.padStart(hex.length + 1, '0')
    : hex
}

/**
 * Convert a @p-encoded string to a Buffer.
 *
 * @param  {String}  name
 * @return  {Buffer}
 */
const patp2buf = name =>
  Buffer.from(patp2hex(name), 'hex')

/**
 * Convert a @p-encoded string to a bignum.
 *
 * @param  {String}  name @p
 * @return  {BN}
 */
const patp2bn = name =>
  new BN(patp2hex(name), 'hex')

/**
 * Convert a @p-encoded string to a decimal-encoded string.
 *
 * @param  {String}  name @p
 * @return  {String}
 */
const patp2dec = name => {
  let bn
  try {
    bn = patp2bn(name)
  } catch(_) {
    throw new Error('patp2dec: not a valid @p')
  }
  return bn.toString()
}

/**
 * Convert a number to a @q-encoded string.
 *
 * @param  {String, Number, BN}  arg
 * @return  {String}
 */
const patq = (arg) => {
  const bn = new BN(arg)
  const buf = bn.toArrayLike(Buffer)
  return buf2patq(buf)
}

/**
 * Convert a Buffer into a @q-encoded string.
 *
 * @param  {Buffer}  buf
 * @return  {String}
 */
const buf2patq = buf => {
  const chunked =
    buf.length % 2 !== 0 && buf.length > 1
    ? lodash.concat([[buf[0]]], lodash.chunk(buf.slice(1), 2))
    : lodash.chunk(buf, 2)

  const prefixName = byts =>
    lodash.isUndefined(byts[1])
    ? prefixes[0] + suffixes[byts[0]]
    : prefixes[byts[0]] + suffixes[byts[1]]

  const name = byts =>
    lodash.isUndefined(byts[1])
    ? suffixes[byts[0]]
    : prefixes[byts[0]] + suffixes[byts[1]]

  const alg = pair =>
    pair.length % 2 !== 0 && chunked.length > 1
    ? prefixName(pair)
    : name(pair)

  return chunked.reduce((acc, elem) =>
    acc + (acc === '~' ? '' : '-') + alg(elem), '~')
}

/**
 * Convert a hex-encoded string to a @q-encoded string.
 *
 * Note that this preserves leading zero bytes.
 *
 * @param  {String}  hex
 * @return  {String}
 */
const hex2patq = arg => {
  const hex =
    arg.length % 2 !== 0
    ? arg.padStart(arg.length + 1, '0')
    : arg

  const buf = Buffer.from(hex, 'hex')
  return buf2patq(buf)
}

/**
 * Convert a @q-encoded string to a hex-encoded string.
 *
 * Note that this preserves leading zero bytes.
 *
 * @param  {String}  name @q
 * @return  {String}
 */
const patq2hex = name => {
  if (isValidPat(name) === false) {
    throw new Error('patq2hex: not a valid @q')
  }
  const chunks = lodash.split(name.slice(1), '-')
  const dec2hex = dec =>
    dec.toString(16).padStart(2, '0')

  const splat = lodash.map(chunks, chunk => {
    let syls = splitAt(3, chunk)
    return syls[1] === ''
      ? dec2hex(suffixes.indexOf(syls[0]))
      : dec2hex(prefixes.indexOf(syls[0])) +
        dec2hex(suffixes.indexOf(syls[1]))
  })

  return name.length === 0
    ? '00'
    : splat.join('')
}

/**
 * Convert a @q-encoded string to a bignum.
 *
 * @param  {String}  name @q
 * @return  {BN}
 */
const patq2bn = name =>
  new BN(patq2hex(name), 'hex')

/**
 * Convert a @q-encoded string to a Buffer.
 *
 * @param  {String}  name @q
 * @return  {Buffer}
 */
const patq2buf = name => {
  const hex = patq2hex(name)
  return Buffer.from(hex, 'hex')
}

/**
 * Convert a @q-encoded string to a decimal-encoded string.
 *
 * @param  {String}  name @q
 * @return  {String}
 */
const patq2dec = name => {
  let bn
  try {
    bn = patq2bn(name)
  } catch(_) {
    throw new Error('patq2dec: not a valid @q')
  }
  return bn.toString()
}

/**
 * Determine the ship class of a @p value.
 *
 * @param  {String}  @p
 * @return  {String}
 */
const clan = who => {
  let name
  try {
    name = patp2bn(who)
  } catch(_) {
    throw new Error('clan: not a valid @p')
  }

  const wid = met(three, name)
  return wid.lte(one)
    ? 'galaxy'
    : wid.eq(two)
    ? 'star'
    : wid.lte(four)
    ? 'planet'
    : wid.lte(new BN(8))
    ? 'moon'
    : 'comet'
}

/**
 * Determine the parent of a @p value.
 *
 * @param  {String}  @p
 * @return  {String}
 */
const sein = name => {
  let who
  try {
    who = patp2bn(name)
  } catch(_) {
    throw new Error('sein: not a valid @p')
  }

  let mir
  try {
    mir = clan(name)
  } catch(_) {
    throw new Error('sein: not a valid @p')
  }

  const res =
    mir === 'galaxy'
    ? who
    : mir === 'star'
    ? end(three, one, who)
    : mir === 'planet'
    ? end(four, one, who)
    : mir === 'moon'
    ? end(five, one, who)
    : zero
  return patp(res)
}

/**
 * Weakly check if a string is a valid @p or @q value.
 *
 * This is, at present, a pretty weak sanity check.  It doesn't confirm the
 * structure precisely (e.g. dashes), and for @q, it's required that q values
 * of (greater than one) odd bytelength have been zero-padded.  So, for
 * example, '~doznec-binwod' will be considered a valid @q, but '~nec-binwod'
 * will not.
 *
 * @param  {String}  name a @p or @q value
 * @return  {String}
 */
const isValidPat = name => {
  if (typeof name !== 'string') {
    throw new Error('isValidPat: non-string input')
  }

  const syls = patp2syls(name)

  const leadingTilde = name.slice(0, 1) === '~'

  if (leadingTilde === false) {
    return false
  } else {
    const wrongLength = syls.length % 2 !== 0 && syls.length !== 1
    const sylsExist = lodash.reduce(syls, (acc, syl, index) =>
      acc &&
        (index % 2 !== 0 || syls.length === 1
          ? suffixes.includes(syl)
          : prefixes.includes(syl)),
      true)

    return !wrongLength && sylsExist
  }
}

/**
 * Remove all leading zero bytes from a sliceable value.
 * @param  {String, Buffer, Array}
 * @return  {String}
 */
const removeLeadingZeroBytes = str =>
  str.slice(0, 2) === '00'
  ? removeLeadingZeroBytes(str.slice(2))
  : str

/**
 * Equality comparison, modulo leading zero bytes.
 * @param  {String, Buffer, Array}
 * @param  {String, Buffer, Array}
 * @return  {Bool}
 */
const eqModLeadingZeroBytes = (s, t) =>
  lodash.isEqual(removeLeadingZeroBytes(s), removeLeadingZeroBytes(t))

/**
 * Equality comparison on @q values.
 * @param  {String}  p a @q-encoded string
 * @param  {String}  q a @q-encoded string
 * @return  {Bool}
 */
const eqPatq = (p, q) => {
  let phex
  try {
    phex = patq2hex(p)
  } catch(_) {
    throw new Error('eqPatq: not a valid @q')
  }

  let qhex
  try {
    qhex = patq2hex(q)
  } catch(_) {
    throw new Error('eqPatq: not a valid @q')
  }

  return eqModLeadingZeroBytes(phex, qhex)
}

const vatp = (arg) => {
  const n = new BN(arg)

  const sxz = ob.fein(n)
  const dyy = met(four, sxz)

  const loop = (tsxz, timp, trep) => {
    const log = end(four, one, tsxz)
    const pre = prefixes[rsh(three, one, log)]
    const suf = suffixes[end(three, one, log)]
    const etc =
      (timp.mod(four)).eq(zero)
        ? timp.eq(zero)
          ? ''
          : '--'
        : '-'

    const res = pre + suf + etc + trep

    return timp.eq(dyy)
      ? trep
      : loop(rsh(four, one, tsxz), timp.add(one), res)
  }

  const dyx = met(three, sxz)

  return '~' +
    (dyx.lte(one)
    ? suffixes[sxz]
    : loop(sxz, zero, ''))
}

module.exports = {
  patp,
  patp2hex,
  hex2patp,
  patp2dec,
  patq,
  patq2hex,
  hex2patq,
  patq2dec,
  clan,
  sein,
  eqPatq,
  isValidPatq: isValidPat, // reserving for diff impls in future
  isValidPatp: isValidPat,

  vatp
}
