const fp = require('fastify-plugin')
const schema = require('./schema')
const { TooManyRequests } = require('http-errors')
// const { checkInInsert } = require('./query')

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
    method: 'POST',
    path: '/users/login',
    schema: schema.login,
    handler: onLogin
  })
  async function onLogin (req, reply) {
    // TODO get data from DB
    const token = await reply.jwtSign(
      { id: '1' }
    )

    // const decoded = server.jwt.verify(token)

    const user = { email: 'tests', token, username: 'username', bio: 'bio', image: '' }
    return { user }
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
    schema: schema.get,
    handler: onGet,
    onRequest: [server.authenticate]
  })
  async function onGet (req, reply) {
  //  req.authenticate()
    console.log(req.user)
    console.log(req.user)
    console.log(req.user)
    console.log(req.user)
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
