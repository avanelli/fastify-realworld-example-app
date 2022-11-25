'use strict'
const t = require('tap')
const startServer = require('../setup-server')

t.test('requests the "/tags" route', async t => {
  const server = await startServer()
  t.teardown(() => server.close())

  const response = await server.inject({
    method: 'GET',
    url: '/api/tags'
  })

  t.equal(response.statusCode, 200, 'returns a status code of 200')
  t.equal(JSON.parse(response.body).tags.length, 0, 'returns an empty array')
  t.end()
})
