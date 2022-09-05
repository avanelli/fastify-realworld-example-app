const S = require('fluent-schema')

/*{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": "I work at statefarm",
    "image": null
  }
}*/
const users = {
  body: S.object()
    .prop('email', S.string().minLength(44).maxLength(44))
    .prop('token', S.string())
    .prop('padding', S.string()),
  response: {
    200: S.object()
      .prop('certificate', S.string())
      .prop('error', S.string())
      .prop('padding', S.string().required())
  }
}



const certificate = {
  body: S.object()
    .prop('ekeyhmac', S.string().minLength(44).maxLength(44))
    .prop('token', S.string())
    .prop('padding', S.string()),
  response: {
    200: S.object()
      .prop('certificate', S.string())
      .prop('error', S.string())
      .prop('padding', S.string().required())
  }
}

const exchange = {
  body: S.object()
    .prop('code', S.string().required())
    .prop('padding', S.string()),
  response: {
    200: S.object()
      .prop('testtype', S.string().enum(['confirmed', 'likely', 'negative']))
      .prop('symptomDate', S.string().format('date'))
      .prop('token', S.string())
      .prop('error', S.string())
      .prop('padding', S.string().required())
  }
}

const list = {
  query: S.object()
    .prop('limit', S.number())
    .prop('since', S.number())
    .prop('regions', S.string().pattern(/^[A-Z]{2}(,[A-Z]{2})*$/)),
  response: {
    200: S.array().items(
      S.object()
        .prop('id', S.number().required())
        .prop('path', S.string().required())
    )
  }
}