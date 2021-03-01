const cookie = require('cookie')
const cookieSignature = require('cookie-signature')

module.exports = async function (smallify, opts) {
  opts.secret = opts.secret || ''

  const { $root } = smallify
  const { secret } = opts

  $root.decorateRequest('cookies', null)

  $root.decorateRequest('unsignCookie', function (value) {
    return cookieSignature.unsign(value, secret)
  })

  $root.decorateReply('setCookie', function (name, value, options) {
    const opts = Object.assign({}, options || {})

    if (opts.expires && Number.isInteger(opts.expires)) {
      opts.expires = new Date(opts.expires)
    }

    if (opts.signed) {
      value = cookieSignature.sign(value, secret)
    }

    const serialized = cookie.serialize(name, value, opts)

    let setCookie = this.getHeader('Set-Cookie')
    if (!setCookie) {
      this.header('Set-Cookie', serialized)
      return this
    }

    if (typeof setCookie === 'string') {
      setCookie = [setCookie]
    }

    setCookie.push(serialized)
    this.removeHeader('Set-Cookie')
    this.header('Set-Cookie', setCookie)
    return this
  })

  $root.decorateReply('clearCookie', function (name, options) {
    const opts = Object.assign({ path: '/' }, options || {}, {
      expires: new Date(1),
      signed: undefined,
      maxAge: undefined
    })
    this.setCookie(name, '', opts)
    return this
  })

  $root.addHook('onRequest', function (req, rep) {
    req.cookies = {}
    const cookieHeader = req.headers.cookie
    if (cookieHeader) {
      req.cookies = cookie.parse(cookieHeader)
    }
  })
}
