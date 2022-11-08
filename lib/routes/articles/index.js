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
    return await articlesModel.getArticles(currid, req.query)
  }

  server.route({
    method: 'GET',
    path: '/articles/feed',
    onRequest: [server.authenticate],
    schema: schema.getFeed,
    handler: onGetFeed
  })
  async function onGetFeed (req, reply) {
    return await articlesModel.getArticlesFeed(req.user.id, req.query)
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

  server.route({
    method: 'POST',
    path: '/articles',
    onRequest: [server.authenticate],
    schema: schema.insert,
    handler: onCreateArticle
  })
  async function onCreateArticle (req, reply) {
    const article = await articlesModel.createArticle(req.user.id, req.body.article)
    reply.code(201)
    return { article }
  }

  server.route({
    method: 'PUT',
    path: '/articles/:slug',
    onRequest: [server.authenticate],
    schema: schema.updateArticle,
    handler: onUpdateArticle
  })
  async function onUpdateArticle (req, reply) {
    const article = await articlesModel.updateArticle(req.user.id, req.params.slug, req.body.article)
    if (!article) throw createError(404, 'Article not found')
    return article
  }

  server.route({
    method: 'DELETE',
    path: '/articles/:slug',
    onRequest: [server.authenticate],
    schema: schema.deleteArticle,
    handler: onDeleteArticle
  })
  async function onDeleteArticle (req, reply) {
    const article = await articlesModel.deleteArticle(req.user.id, req.params.slug)
    if (!article) throw createError(404, 'Article not found')
    reply.code(204)
    return ''
  }

  done()
}

module.exports = fp(profiles)
