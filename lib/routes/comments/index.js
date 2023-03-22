const fp = require('fastify-plugin')
const schema = require('./schema')
const createError = require('http-errors')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints

async function comments (server, options, done) {
  const commentsModel = require('../../models/comments')(server.knex)

  server.route({
    method: 'GET',
    path: options.prefix + 'articles/:slug/comments',
    onRequest: [server.authenticate_optional],
    schema: schema.get,
    handler: onGetComments
  })
  async function onGetComments (req, reply) {
    const currid = req.user ? req.user.id : ''
    const comments = await commentsModel.getComments(currid, req.params.slug)
    return { comments }
  }

  server.route({
    method: 'POST',
    path: options.prefix + 'articles/:slug/comments',
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
    path: options.prefix + 'articles/:slug/comments/:id',
    onRequest: [server.authenticate],
    schema: schema.del,
    handler: onDeleteComment
  })
  async function onDeleteComment (req, reply) {
    const comment = await commentsModel.getComment(req.user.id, req.params.id)
    if (!comment) throw createError(404, 'Comment not found')
    if (comment.author.username !== req.user.username) throw createError(403, 'Forbidden')
    await commentsModel.deleteComment(req.user.id, req.params.id)
    reply.code(204)
    return ''
  }

  done()
}

module.exports = fp(comments)
