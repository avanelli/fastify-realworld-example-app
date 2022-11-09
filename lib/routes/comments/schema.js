const S = require('fluent-json-schema')
const profile = require('../profiles/schema')

const Comment =
    S.object()
      .prop('id', S.number().required())
      .prop('createdAt', S.string().required())
      .prop('updatedAt', S.string().required())
      .prop('body', S.string().required())
      .prop('author', profile.Profile)

const get = {
  response: {
    200: S.object()
      .prop('comments', S.array().items(Comment).required()),
    404: S.object().prop('message', S.string())
  }
}

const add = {
  body: S.object()
    .prop('comment', S.object()
      .prop('body', S.string().required())
    ),
  response: {
    201: S.object()
      .prop('comment', Comment.required()),
    404: S.object().prop('message', S.string())
  }
}

const del = {
  response: {
    204: S.null(),
    404: S.object().prop('message', S.string())
  }
}

module.exports = { get, add, del }
