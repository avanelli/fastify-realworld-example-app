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
    schema: schema.getArticles,
    handler: onGetArticles
  })
  async function onGetArticles (req, reply) {
    const currid = req.user ? req.user.id : ''
    return await articlesModel.getArticles(currid)
  }

  server.route({
    method: 'GET',
    path: '/articles/feed',
    onRequest: [server.authenticate],
    schema: schema.getFeed,
    handler: onGetFeed
  })
  async function onGetFeed (req, reply) {
    return await articlesModel.getArticlesFeed(req.user.id)
  }

  server.route({
    method: 'GET',
    path: '/articles/:slug',
    onRequest: [server.authenticate_optional],
    schema: schema.getArticle,
    handler: onGetArticle
  })
  async function onGetArticle (req, reply) {
    const article = await articlesModel.getArticle(req.params.slug)
    if (!article) throw createError(404, 'Article not found')
    return article
  }

  done()
}

module.exports = fp(profiles)
