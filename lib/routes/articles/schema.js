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

const getArticle = {
  response: {
    200: S.object().prop('article', Article.required()),
    404: S.object().prop('message', S.string())
  }
}

const getArticles = {
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
const getFeed = {
  querystring: S.object()
    .prop('limit', S.number())
    .prop('offset', S.number()),
  response: {
    200: S.object()
      .prop('articles', S.array().items(Article).required())
      .prop('articlesCount', S.number().required())
  }
}

const insert = {
  body: S.object()
    .prop('article', S.object()
      .prop('title', S.string().required())
      .prop('description', S.string().required())
      .prop('body', S.string().required())
      .prop('tagList', S.array().items(S.string()).required())
    ),
  response: {
    201: S.object()
      .prop('article', Article.required())
  }
}

const update = {
  body: S.object()
    .prop('article', S.object()
      .prop('title', S.string())
      .prop('description', S.string())
      .prop('body', S.string())
    ),
  response: {
    200: S.object()
      .prop('article', Article.required())
  }
}

const remove = {
  response: {
    404: S.object().prop('message', S.string())
  }
}

module.exports = { getArticles, getArticle, getFeed, insert, update, remove }
