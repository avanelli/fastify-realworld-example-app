const S = require('fluent-json-schema')
const profile = require('../profiles/schema')

const Article =
  S.object()
    .prop('slug', S.string().required())
    .prop('title', S.string().required())

... da finire 
const profileResp = {
  response: {
    200: S.object().prop('profile', Profile),
    404: S.object().prop('message', S.string())
  }
}

module.exports = { profileResp }
