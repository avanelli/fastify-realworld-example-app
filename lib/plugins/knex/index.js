'use strict'

const fp = require('fastify-plugin')
const knex = require('knex')

async function fastifyKnexJS (fastify, options, next) {
  try {
    const handler = knex(options.knex)
    // this will force migration and seed to run before the server starts
    // because we are using in memory sqlite for the demo
    await handler.migrate.latest()
    await handler.seed.run()

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
