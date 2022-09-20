const fp = require('fastify-plugin')
const bcrypt = require('bcrypt')

function fastifyBcrypt (fastify, options, next) {
  try {
    fastify.decorate('hash', async function (plain) {
      return bcrypt.hash(plain, options.bcrypt.saltRounds || 10)
    })
    fastify.decorate('hashCompare', async function (plain, hash) {
      return bcrypt.compare(plain, hash)
    })

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(fastifyBcrypt)
