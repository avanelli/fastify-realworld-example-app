const fp = require('fastify-plugin')
const schema = require('./schema')
const createError = require('http-errors')
const { isUndefined } = require('knex/lib/util/is')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints

async function users (server, options, done) {
  const userModel = require('../../models/users')(server.knex)

  async function createToken (user, reply) {
    return await reply.jwtSign(
      { id: user.id, username: user.username }
    )
  }

  /**
   * User Login
   */
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
      if (!await server.hashCompare(req.body.user.password, user.password)) {
        // generate Jwt
        user.token = await createToken(user, reply)
        return { user }
      }
    }
    return createError.Unauthorized('Wrong credentials')
  }

  /**
   * User Register
   */
  server.route({
    method: 'POST',
    path: '/users',
    schema: schema.register,
    handler: onRegister
  })
  async function onRegister (req, reply) {
    if (isUndefined(await userModel.getUserByEmail(req.body.user.email)) &&
          isUndefined(await userModel.getUserByUsername(req.body.user.username))) {
      const user = await userModel.registerUser(req.body.user)
      user.token = await createToken(user, reply)
      return { user }
    }
    reply
      .code(409)
      .send({ message: 'duplicate user' })
  }

  server.route({
    method: 'GET',
    path: '/user',
    onRequest: [server.authenticate],
    schema: schema.get,
    handler: onGet
  })
  async function onGet (req, reply) {
    let user = await userModel.getUserById(req.user.id)
    if (!isUndefined(user)) {
      const token = await server.jwt.lookupToken(req)
      user = { ...user, token }
      return { user }
    } else {
      reply
        .code(404)
        .send({ message: 'not found' })
    }
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
