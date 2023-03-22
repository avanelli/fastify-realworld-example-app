const S = require('fluent-json-schema')

const sentiment = {
  body: S.object()
    .prop('content', S.string().required()),
  response: {
    200: S.object().prop('score', S.string().required())
  }
}

module.exports = { sentiment }
