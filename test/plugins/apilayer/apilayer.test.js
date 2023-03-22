const test = require('tap').test
const apiLayer = require('../../../lib/plugins/apilayer')
const fetchMock = require('fetch-mock')

test('post returns the expected response', async (t) => {
  let myservice
  const fastify = {
    decorate:
        (name, service) => {
          myservice = service
        }
  }
  await apiLayer(fastify, { apilayer: { key: '123' } })

  fetchMock.mock('*', { tags: ['tag1', 'tag2'] })
  const response = await myservice.post('Some content', 'host', 'url')

  t.ok(fetchMock.called(), 'fetch was called')
  t.equal(response.tags[0], 'tag1', 'should return the expected response')
})
