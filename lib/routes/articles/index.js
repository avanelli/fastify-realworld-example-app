const fp = require('fastify-plugin')
const schema = require('./schema')
const createError = require('http-errors')

// SEE https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints

async function profiles (server, options, done) {
  const profilesModel = require('../../models/profiles')(server.knex)

  server.route({
    method: 'GET',
    path: '/articles',
    onRequest: [server.authenticate_optional],
    schema: schema.profileResp,
    handler: onGetArticles
  })
  async function onGetArticles (req, reply) {
    Returns most recent articles globally by default,
  }

  server.route({
    method: 'POST',
    path: '/profiles/:username/follow',
    onRequest: [server.authenticate],
    schema: schema.profileResp,
    handler: onFollow
  })
  async function onFollow (req, reply) {
    const { username } = req.params
    const profile = await profilesModel.getProfileByUsername(req.user.id, username)
    if (profile.username) {
      if (profile.follow === false) {
        await profilesModel.followProfile(req.user.id, profile.id)
        profile.follow = true
      }
      return { profile }
    } else {
      return createError.NotFound('not found')
    }
  }

  server.route({
    method: 'DELETE',
    path: '/profiles/:username/follow',
    onRequest: [server.authenticate],
    schema: schema.profileResp,
    handler: onUnfollow
  })
  async function onUnfollow (req, reply) {
    const { username } = req.params
    const profile = await profilesModel.getProfileByUsername(req.user.id, username)
    if (profile.username) {
      if (profile.follow === true) {
        await profilesModel.unfollowProfile(req.user.id, profile.id, false)
        profile.follow = false
      }
      return { profile }
    } else {
      return createError.NotFound('not found')
    }
  }

  done()
}

module.exports = fp(profiles)
