'use strict';

const fastifyPlugin = require('fastify-plugin');
const knex = require('knex');

function fastifyKnexJS(fastify, options, next) {
  try {
    const handler = knex(options.knex);

    fastify
      .decorate('knex', handler)
      .addHook('onClose', (instance, done) => {
        /* istanbul ignore else */
        if (instance.knex === handler) {
          instance.knex.destroy();
          delete instance.knex;
        }

        done();
      });

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = fastifyPlugin(fastifyKnexJS, '>=0.30.0');