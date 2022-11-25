const getConfig = require('../lib/config/config')
const startServer = require('../lib/server')

const start = async () => {
  process.on('unhandledRejection', (err) => {
    console.error(err)
    process.exit(1)
  })
  const config = await getConfig()
  config.fastifyInit.logger.level = 'silent'
  const server = require('fastify')(config.fastifyInit)
  server.register(startServer, config)
  return server
}

module.exports = start
