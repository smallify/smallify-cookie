const Smallify = require('smallify')
const smallifyCookie = require('./index')

const smallify = Smallify({
  pino: {
    level: 'info',
    prettyPrint: true
  }
})

smallify.register(smallifyCookie, {
  secret: '123456789'
})

smallify.route({
  url: '/hello',
  method: 'GET',
  handler (req, rep) {
    const { cookies } = req
    // console.log(cookies)
    if (!cookies.token) {
      rep.setCookie('token', '8888888', { signed: true })
      rep.setCookie('aaaa', 'ccccc', { signed: true, maxAge: 300000 })
    } else {
      this.$log.info(req.unsignCookie(cookies.token))
      // rep.clearCookie('token')
    }
    rep.send('hello world')
  }
})

smallify.ready(err => {
  err && smallify.$log.error(err.message)
  smallify.print()
})
