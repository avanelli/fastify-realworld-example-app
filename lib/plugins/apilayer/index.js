'use strict'
const fp = require('fastify-plugin')

async function apiLayer (fastify, options) {
  const apiKey = options.apilayer.key

  fastify.decorate('apiLayer', {
    async post22 (content, url) {
      /* const myHeaders = new Headers()
      myHeaders.append('apikey', '6EwQsWNDR4AoSvFCHAsFUhmxkuALN13F')
*/
      const raw = 'You have done excellent work, and well done.'

      const requestOptions = {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'content-type': 'text/plain',
          apikey: '6EwQsWNDR4AoSvFCHAsFUhmxkuALN13F'
        },
        body: raw
      }
      const response = await fetch(url, requestOptions)
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`
        throw new Error(message)
      }
      return await response.json()
    },
    async post (content, url) {
      const options = {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'content-type': 'text/plain',
          apikey: apiKey
        },
        body: content
      }

      const response = await fetch(url, options)
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`
        throw new Error(message)
      }
      return await response.json()
    }

  })
}

module.exports = fp(apiLayer)
