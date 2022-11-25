'use strict'
const t = require('tap')
const startServer = require('../setup-server')

t.test('get current user without login', async t => {
  const server = await startServer()
  t.teardown(() => server.close())

  const response = await server.inject({
    method: 'GET',
    url: '/api/user'
  })
  t.equal(response.statusCode, 401, 'returns a status code of 401 Unauthorized')
  t.end()
})
