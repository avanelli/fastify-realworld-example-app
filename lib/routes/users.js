const fp = require('fastify-plugin')
//const schema = require('./schema')
const { TooManyRequests } = require('http-errors')
//const { checkInInsert } = require('./query')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints

// TypeOrm fastify example 
// https://dev-to.translate.goog/carlbarrdahl/building-a-rest-api-using-fastify-and-typeorm-39bp?_x_tr_sl=en&_x_tr_tl=it&_x_tr_hl=it&_x_tr_pto=op,sc


async function users (server, options, done) {
  server.route({
    method: 'GET',
    url: '/users',
    //schema: schema.users,
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

module.exports = fp(users)
