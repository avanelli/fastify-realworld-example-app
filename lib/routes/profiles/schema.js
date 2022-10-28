const S = require('fluent-json-schema')

const Profile =
  S.object()
    .prop('username', S.string().required())
    .prop('bio', S.string().required())
    .prop('image', S.string().required())
    .prop('following', S.boolean().required())

const profileResp = {
  response: {
    200: S.object().prop('profile', Profile),
    404: S.object().prop('message', S.string())
  }
}

module.exports = { profileResp }
