'use strict'

const fp = require('fastify-plugin')
const knex = require('knex')

function fastifyKnexJS (fastify, options, next) {
  try {
    const handler = knex(options.knex)
    // TODO consider to use files instead of memory
    handler.migrate.latest()
      .then(function () {
        handler.seed.run()
      })

    fastify
      .decorate('knex', handler)
      .addHook('onClose', (instance, done) => {
        /* istanbul ignore else */
        if (instance.knex === handler) {
          instance.knex.destroy()
          delete instance.knex
        }

        done()
      })

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(fastifyKnexJS, '>=0.30.0')
