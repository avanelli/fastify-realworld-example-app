const { faker } = require('@faker-js/faker')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('articles').del()
  await knex('articles').insert(
    Array.from({ length: 5 }, (v, i) => {
      return {
        id: i,
        slug: faker.lorem.slug(),
        title: faker.lorem.sentence(),
        description: faker.lorem.sentences(),
        body: faker.lorem.paragraphs(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: i
      }
    })
  )
}
