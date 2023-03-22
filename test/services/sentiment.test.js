const test = require('tap').test
const sentimentService = require('../../lib/services/sentiment')

test('getSentiment returns the expected score', async (t) => {
  let myservice
  const fastify = {
    decorate:
        (name, service) => {
          myservice = service
        },
    apiLayer: {
      post: () => {
        return { sentiment: 'positive' }
      }
    }
  }
  await sentimentService(fastify, {})

  const response = await myservice.getSentiment('Some content')
  t.equal(response, 1, 'should return the expected score')
})

test('splitString returns correct chunks number with long text', async (t) => {
  let myservice
  const fastify = {
    decorate:
        (name, service) => {
          myservice = service
        }
  }
  await sentimentService(fastify, {})

  const response = await myservice.splitString('Some content '.repeat(10), 100)
  t.equal(response.length, 2, 'should return the expected number of chunks')
})

test('getSentimentApi returns 0 on apiLayer error', async (t) => {
  let myservice
  const fastify = {
    decorate:
        (name, service) => {
          myservice = service
        },
    rapidApi: {
      post: () => {
        throw new Error('Error')
      }
    }
  }
  await sentimentService(fastify, {})

  const response = await myservice.getSentimentApi('Some content')
  t.equal(response, 0, 'should return 0 on error')
})
