const fp = require('fastify-plugin')
const schema = require('./schema')

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
    const currid = req.user ? req.user.id : ''
    const article = await articlesModel.getArticle(currid, req.params.slug)
    if (!article) {
      reply.code(404)
        .send({ message: 'not found' })
    } else {
      return { article }
    }
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
    schema: schema.update,
    handler: onUpdateArticle
  })
  async function onUpdateArticle (req, reply) {
    const article = await articlesModel.updateArticle(req.user.id, req.params.slug, req.body.article)
    if (!article) {
      reply.code(404)
        .send({ message: 'not found' })
    } else {
      return { article }
    }
  }

  server.route({
    method: 'DELETE',
    path: '/articles/:slug',
    onRequest: [server.authenticate],
    schema: schema.remove,
    handler: onDeleteArticle
  })
  async function onDeleteArticle (req, reply) {
    const article = await articlesModel.deleteArticle(req.user.id, req.params.slug)
    if (!article) {
      reply.code(404)
        .send({ message: 'not found' })
    } else {
      reply.code(204)
    }
    return ''
  }

  server.route({
    method: 'POST',
    path: '/articles/:slug/favorite',
    onRequest: [server.authenticate],
    schema: schema.getArticle,
    handler: onFavoriteArticle
  })
  async function onFavoriteArticle (req, reply) {
    const article = await articlesModel.favoriteArticle(req.user.id, req.params.slug)
    if (!article) {
      reply.code(404)
        .send({ message: 'not found' })
    } else {
      return { article }
    }
  }
  server.route({
    method: 'DELETE',
    path: '/articles/:slug/favorite',
    onRequest: [server.authenticate],
    schema: schema.getArticle,
    handler: onUnfavoriteArticle
  })
  async function onUnfavoriteArticle (req, reply) {
    const article = await articlesModel.unfavoriteArticle(req.user.id, req.params.slug)
    if (!article) {
      reply.code(404)
        .send({ message: 'not found' })
    } else {
      return { article }
    }
  }

  done()
}

module.exports = fp(profiles)
