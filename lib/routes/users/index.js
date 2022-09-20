const fp = require('fastify-plugin')
const schema = require('./schema')
const { TooManyRequests } = require('http-errors')
const { isUndefined } = require('knex/lib/util/is')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints

async function users (server, options, done) {
  const userModel = require('../../models/users')(server.knex)

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
    method: 'POST',
    path: '/users/login',
    schema: schema.login,
    handler: onLogin
  })
  async function onLogin (req, reply) {
    const user = await userModel.getUserByEmail(req.body.user.email)
    if (!isUndefined(user)) {
      // check password

      if (await server.hashCompare(req.body.user.password, user.password)) {
        console.debug(1)
      }

      // generate Jwt
      user.token = await reply.jwtSign(
        { id: user.id, username: user.username }
      )
      return { user }
    } else {
      // TODO add proper HTTP response code
      return 'not found'
    }
  }

  server.route({
    method: 'POST',
    path: '/users',
    schema: schema.register,
    handler: onRegister
  })
  async function onRegister (req, reply) {
    // TODO get data from DB
    // TODO create token
    const user = { email: req.body.user.email, token: 'token', username: 'username', bio: 'bio', image: '' }
    return { user }
  }

  server.route({
    method: 'GET',
    path: '/user',
    onRequest: [server.authenticate],
    schema: schema.get,
    handler: onGet
  })
  async function onGet (req, reply) {
    console.log(req.user)

    // TODO get data from DB
    // TODO create token
    const user = { email: 'email', token: 'token', username: 'username', bio: 'bio', image: '' }
    return { user }
  }

  server.route({
    method: 'PUT',
    path: '/user',
    schema: schema.update,
    handler: onUpdate
  })
  async function onUpdate (req, reply) {
    // TODO get data from DB
    // TODO create token
    const user = { email: 'email', token: 'token', username: 'username', bio: 'bio', image: '' }
    return { user }
  }

  done()
}

module.exports = fp(users)
