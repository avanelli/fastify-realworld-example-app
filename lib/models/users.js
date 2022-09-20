/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  const module = {}

  module.getUserByEmail = async function (email) {
    return knex('users')
      .first()
      .where({ email })
  }

  return module
}
