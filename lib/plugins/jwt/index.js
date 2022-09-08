// TODO vedere meglio qua l'utilizzo
// https://github.com/fastify/fastify-jwt

const fp = require('fastify-plugin')
const { Unauthorized } = require('http-errors')

module.exports = fp(async function (fastify, opts) {
  fastify.register(require('@fastify/jwt'), {
    secret: opts.security.jwtSecret,
    expiresIn: opts.security.refreshTokenExpiry,
    issuer: opts.security.jwtIssuer
  })

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      request.headers.authorization = request.headers.authorization.replace(/^Token /, 'Bearer ')
      await request.jwtVerify()
    } catch (err) {
      throw new Unauthorized()
      // reply.send(err)
    }
  })
})
