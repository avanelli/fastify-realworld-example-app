const fp = require('fastify-plugin')
const schema = require('./schema')
const createError = require('http-errors')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints

async function profiles (server, options, done) {
  const articlesModel = require('../../models/articles')(server.knex)

  server.route({
    method: 'GET',
    path: '/articles',
    onRequest: [server.authenticate_optional],
    schema: schema.profileResp,
    handler: onGetArticles
  })
  async function onGetArticles (req, reply) {
    const currid = req.user ? req.user.id : ''
    return await articlesModel.getArticles(currid)
  }

  done()
}

module.exports = fp(profiles)
