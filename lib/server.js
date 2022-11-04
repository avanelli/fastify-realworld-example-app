const path = require('path')
const fp = require('fastify-plugin')
const autoLoad = require('@fastify/autoload')
const cors = require('@fastify/cors')

/**
 * Configure and starts Fastify server with all required plugins and routes
 * @async
 * @param {Object} config - optional configuration options (default to ./config module)
 *                          May contain a key per plugin (key is plugin name), and an extra
 *                          'fastify' key containing the server configuration object
 * @returns {Fastify.Server} started Fastify server instance
 */

async function plugin (server, config) {
  server
    .register(cors, {})
    .register(autoLoad, {
      dir: path.join(__dirname, 'plugins'),
      options: config
    })
    .register(autoLoad, {
      dir: path.join(__dirname, 'routes'),
      options: config
    })

  server.setErrorHandler((err, req, res) => {
    req.log.error({ req, res, err }, err && err.message)
    err.message = 'An error has occurred'
    res.send(err)
  })
}

module.exports = fp(plugin)
