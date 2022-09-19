const fp = require('fastify-plugin')
const { Unauthorized } = require('http-errors')

module.exports = fp(async function (fastify, opts) {
  fastify.register(require('@fastify/jwt'), {
    secret: opts.security.jwtSecret,
    expiresIn: opts.security.refreshTokenExpiry,
    issuer: opts.security.jwtIssuer,
    verify: {
      extractToken: (req) => {
        return req.headers.authorization.replace(/^Token /, '')
      }
    }
  })

  fastify.decorate('authenticate', async function (req, reply) {
    try {
      // request.headers.authorization = request.headers.authorization.replace(/^Token /, 'Bearer ')
      await req.jwtVerify()
    } catch (err) {
      throw new Unauthorized()
    }
  })
})
