const S = require('fluent-json-schema')

const login = {
  // TODO swagger ??
  body:  S.object()
    .id('http:///api/users/login')
    .title('User Login')
    .description('Login user and respond with token')  
    .definition(
      'user',
      S.object()
        .prop('email', S.string().required())
        .prop('password', S.string().required())
    ),

  response: {
      200: S.object().definition(
        'user',
        S.object()
          .prop('email', S.string().required())
          .prop('token', S.string().required())
          .prop('username', S.string().required())
          .prop('bio', S.string().required())
          .prop('image', S.string().required())
      )
    }
}

module.exports = { login }