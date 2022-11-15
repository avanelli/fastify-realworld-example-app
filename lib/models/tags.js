/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  return {
    getTags: async function () {
      return knex('tags')
        .pluck('name')
    }
  }
}
