const fp = require('fastify-plugin')
const schema = require('./schema')
const createError = require('http-errors')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints

async function comments (server, options, done) {
  const commentsModel = require('../../models/comments')(server.knex)

  server.route({
    method: 'GET',
    path: '/articles/:slug/comments',
    onRequest: [server.authenticate_optional],
    schema: schema.getComments,
    handler: onGetComments
  })
  async function onGetComments (req, reply) {
    const currid = req.user ? req.user.id : ''
    return await commentsModel.getComments(currid, req.params.slug)
  }

  server.route({
    method: 'POST',
    path: '/articles/:slug/comments',
    onRequest: [server.authenticate],
    schema: schema.insert,
    handler: onCreateComment
  })
  async function onCreateComment (req, reply) {
    const comment = await commentsModel.createComment(req.user.id, req.params.slug, req.body.comment)
    if (!comment) return createError(404, 'Article not found')
    reply.code(201)
    return { comment }
  }

  server.route({
    method: 'DELETE',
    path: '/articles/:slug/comments/:id',
    onRequest: [server.authenticate],
    schema: schema.del,
    handler: onDeleteComment
  })
  async function onDeleteComment (req, reply) {
    const comment = await commentsModel.getComment(req.user.id, req.params.id)
    if (!comment) throw createError(404, 'Comment not found')
    if (comment.author.id !== req.user.id) throw createError(403, 'Forbidden')
    await commentsModel.deleteComment(req.params.id)
    reply.code(204)
    return null
  }

  done()
}

module.exports = fp(comments)
