'use strict'
const t = require('tap')
const startServer = require('./setup-server')

t.test('requests the "/" route', async t => {
  const server = await startServer()
  t.teardown(() => server.close())

  const response = await server.inject({
    method: 'GET',
    url: '/api/articles'
  })

  t.equal(response.statusCode, 200, 'returns a status code of 200')
  t.end()
})

t.test('requests not existing route', async t => {
  const server = await startServer()
  t.teardown(() => server.close())

  const response = await server.inject({
    method: 'GET',
    url: '/dummy'
  })

  t.equal(response.statusCode, 404, 'returns a status code of 404')
  t.end()
})
