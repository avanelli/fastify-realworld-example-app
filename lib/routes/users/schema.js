const S = require('fluent-json-schema')

const User =
  S.object()
    .prop('email', S.string().required())
    .prop('token', S.string().required())
    .prop('username', S.string().required())
    .prop('bio', S.string().required())
    .prop('image', S.string().required())

const login = {
  // TODO swagger ??
  body: S.object()
    .id('http://api/users/login')
    .title('User Login')
    .description('Login user and respond with token')
    .prop(
      'user',
      S.object()
        .prop('email', S.string().required())
        .prop('password', S.string().required())

    ).required(),

  response: {
    200: S.object().prop('user', User),
    401: S.object().prop('message', S.string())
  }
}

const register = {
  body: S.object()
    .id('http://api/users')
    .title('User Register')
    .description('Register a new user')
    .prop(
      'user',
      S.object()
        .prop('username', S.string().required())
        .prop('email', S.string().required())
        .prop('password', S.string().required())
    ).required(),

  response: {
    200: S.object().prop('user', User)
  }
}

const get = {
  response: {
    200: S.object().prop('user', User),
    404: S.object().prop('message', S.string())
  }
}

const update = {
  body: S.object()
    .id('http://api/user')
    .title('User Register')
    .description('Register a new user')
    .prop(
      'user',
      S.object()
        .prop('email', S.string())
        .prop('username', S.string())
        .prop('password', S.string())
        .prop('bio', S.string())
        .prop('image', S.string())
    ).required(),

  response: {
    200: S.object().prop('user', User)
  }
}

module.exports = { login, register, get, update }
