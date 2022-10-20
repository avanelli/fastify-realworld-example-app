/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  return {

    getUserById: async function (id) {
      return knex('users')
        .first()
        .where({ id })
    },

    getUserByEmail: async function (email) {
      return knex('users')
        .first()
        .where({ email })
    },
    getUserByUsername: async function (username) {
      return knex('users')
        .first()
        .where({ username })
    },

    registerUser: async function (user) {
      const id = await knex('users')
        .returning('id')
        .insert({
          email: user.email,
          username: user.username,
          image: user.image,
          bio: user.bio,
          password: user.password
        })
      console.log(id)
      return await knex('users')
        .first()
        .where({ email: user.email })
    },

    updateUser: async function (user) {
      await knex('users')
        .where({ id: user.id })
        .update(user)
    }

  }
}
