const S = require('fluent-json-schema')
const profile = require('../profiles/schema')

const Article =
  S.object()
    .prop('slug', S.string().required())
    .prop('title', S.string().required())
    .prop('description', S.string().required())
    .prop('body', S.string().required())
    .prop('tagList', S.array().items(S.string()).required())
    .prop('createdAt', S.string().required())
    .prop('updatedAt', S.string().required())
    .prop('favorited', S.boolean().required())
    .prop('favoritesCount', S.number().required())
    .prop('author', profile.Profile)

const get = {
  querystring: S.object()
    .prop('tag', S.string())
    .prop('author', S.string())
    .prop('favorited', S.string())
    .prop('limit', S.number())
    .prop('offset', S.number()),
  response: {
    200: S.object()
      .prop('articles', S.array().items(Article).required())
      .prop('articlesCount', S.number().required())
  }
}

module.exports = { get }
