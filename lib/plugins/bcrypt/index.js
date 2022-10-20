const fp = require('fastify-plugin')
const bcrypt = require('bcrypt')

function fastifyBcrypt (fastify, options, next) {
  try {
    fastify.decorate('hash', async function (plain) {
      return await bcrypt.hash(plain, options.security.jwtSaltRounds)
    })
    fastify.decorate('hashCompare', async function (plain, hash) {
      return await bcrypt.compare(plain, hash)
    })

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(fastifyBcrypt)
