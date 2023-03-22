const fp = require('fastify-plugin')
const schema = require('./schema')

async function comments (server, options, done) {
  const sentimentService = server.sentimentService

  server.route({
    method: 'POST',
    path: options.prefix + 'sentiment/score',
    onRequest: [server.authenticate_optional],
    schema: schema.sentiment,
    handler: onSentimentScore
  })
  async function onSentimentScore (req, reply) {
    const score = await sentimentService.getSentiment(req.body.content)
    return { score }
  }

  done()
}

module.exports = fp(comments)
