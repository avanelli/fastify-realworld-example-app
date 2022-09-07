const fp = require('fastify-plugin')
const schema = require('./schema')
const { TooManyRequests } = require('http-errors')
//const { checkInInsert } = require('./query')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints


async function users (server, options, done) {
  server.route({
    method: 'GET',
    url: '/users',
    schema: schema.users,
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

  server.route({
    method: 'GET',
    path: '/users/login',
     schema: schema.login,
    // lo schema posso definirlo altrove...
    // come fa qua https://github.com/covidgreen/covid-green-backend-api/blob/current/lib/routes/metrics/index.js
    // TODO finire lo schema con body e response
    handler: onLogin
  })
  async function onLogin (req, reply) {
    // TODO ritornare dati fake, poi attaccare knex
    const csrfToken = await reply.generateCsrf()
    return { csrfToken }
  }  

  done()
}

module.exports = fp(users)
