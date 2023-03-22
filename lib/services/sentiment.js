'use strict'
const fp = require('fastify-plugin')

async function sentimentService (fastify, options) {
  const apiLayer = fastify.apiLayer

  fastify.decorate('sentimentService', {
    async getSentiment (content) {
      const slices = this.splitString(content, 1000)

      let score = 0
      for (const slice of slices) {
        score += await this.getSentimentApi(slice)
      }
      return score / slices.length
    },

    async getSentimentApi (content) {
      try {
        const response = await apiLayer.post(content,
          'https://api.apilayer.com/sentiment/analysis')
        switch (response.sentiment) {
          case 'positive':
            return 1
          case 'negative':
            return -1
          default:
            return 0
        }
      } catch (err) {
        console.log(err)
        return 0
      }
    },

    splitString (str, chunkSize = 1000) {
      const words = str.split(' ')
      const chunks = []
      let currentChunk = ''

      for (let i = 0; i < words.length; i++) {
        const word = words[i]

        if ((currentChunk + ' ' + word).length <= chunkSize) {
          currentChunk += (currentChunk === '' ? '' : ' ') + word
        } else {
          chunks.push(currentChunk)
          currentChunk = word
        }
      }

      if (currentChunk !== '') {
        chunks.push(currentChunk)
      }
      return chunks
    }

  })
}

module.exports = fp(sentimentService)
