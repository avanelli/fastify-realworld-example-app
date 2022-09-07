const S = require('fluent-schema')

const forget = {
  response: {
    204: S.null()
  }
}

const refresh = {
  response: {
    200: S.object().prop('token', S.string().required())
  }
}

const register = {
    // TODO swagger ??
    description: 'Route used for user login',
  response: {
    200: S.object().prop('nonce', S.string().required())
  }
}

const verify = {
  body: S.object()
    .prop('nonce', S.string().required())
    .prop(
      'platform',
      S.string().enum(['android', 'ios', 'recaptcha', 'test']).required()
    )
    .prop('deviceVerificationPayload', S.string().required())
    .prop('timestamp', S.number()),
  response: {
    200: S.object()
      .prop('refreshToken', S.string().required())
      .prop('token', S.string().required())
  }
}
/*
response: {
    200: S.object()
      .prop('count', S.integer())
      .prop('redirects', S.array().items(
        S.object()
          .prop('source', S.string())
          .prop('destination', S.string())
          .prop('isPrivate', S.boolean())
          .prop('count', S.integer())
          .prop('created', S.string())
      ))
  }
*/
module.exports = { forget, refresh, register, verify }