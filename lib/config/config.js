const envSchema = require('env-schema')
const S = require('fluent-json-schema')

async function getConfig () {
  const env = envSchema({
    dotenv: true,
    schema: S.object()
      .prop('NODE_ENV', S.string())
      .prop('API_HOST', S.string())
      .prop('API_PORT', S.string())
      .prop(
        'LOG_LEVEL',
        S.string()
          .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
          .default('info')
      )
      
      .prop('JWT_SECRET', S.string())

  })

  const config = {
    fastify: {
      host: env.API_HOST,
      port: +env.API_PORT
    },
    fastifyInit: {
      // trustProxy: 2,
      // disableRequestLogging: true,
      logger: {
        level: env.LOG_LEVEL,
        serializers: {
          req: (request) => ({
            method: request.raw.method,
            url: request.raw.url,
            hostname: request.hostname
          }),
          res: (response) => ({
            statusCode: response.statusCode
          })
        }
      }
    },
    security: {
      jwtSecret: env.JWT_SECRET
    },
    knex: {
      client: 'sqlite3',
      connection: {
        filename: ":memory:"
      },
      useNullAsDefault: true      
    }    
  }

  return config
}

module.exports = getConfig
