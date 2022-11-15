const S = require('fluent-json-schema')

const get = {
  response: {
    200: S.object().prop('tags', S.array().items(S.string()).required()),
    404: S.object().prop('message', S.string())
  }
}

module.exports = { get }
