/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  return {
    getUserByEmail: async function (email) {
      return knex('users')
        .first()
        .where({ email })
    }
  }
}
