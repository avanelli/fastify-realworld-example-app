const bcrypt = require('bcrypt')
const { faker } = require('@faker-js/faker')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert(
    Array.from({ length: 5 }, (v, i) => {
      return {
        id: i,
        email: `user${i}@demo.test`,
        username: faker.name.firstName(),
        password: bcrypt.hashSync(`user${i}pass`, 10),
        bio: faker.lorem.sentences(),
        image: faker.image.avatar()
        // created_at: new Date().toISOString(),
        // updated_at: new Date().toISOString(),
      }
    })
  )
}
