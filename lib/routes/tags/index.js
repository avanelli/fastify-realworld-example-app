const fp = require('fastify-plugin')
const schema = require('./schema')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints

async function tags (server, options, done) {
  const tagsModel = require('../../models/tags')(server.knex)

  server.route({
    method: 'GET',
    path: '/tags',
    schema: schema.getTags,
    handler: onGetTags
  })
  async function onGetTags (req, reply) {
    const tags = await tagsModel.getTags()
    return { tags }
  }

  done()
}

module.exports = fp(tags)
