const fp = require('fastify-plugin')
const schema = require('./schema')
const { TooManyRequests } = require('http-errors')
const { checkInInsert } = require('./query')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints

async function users(server, options, done) {
  
    server.route({
      method: 'GET',
      url: '/users',
      schema: schema.checkIn,
      handler: async (request, response) => {
        const { id } = request.authenticate()
        const { ok, data, ...demographics } = request.body

        const { rowCount } = await server.pg.write.query(
          checkInInsert({
            id,
            ok,
            data,
            demographics,
            timeZone: options.timeZone
          })
        )

        if (rowCount === 0) {
          throw new TooManyRequests()
        }

        response.status(204)
      }
    })
  

  done()
}

module.exports = fp(checkIn)