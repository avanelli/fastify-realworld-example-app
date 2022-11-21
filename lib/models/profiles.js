/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  return {

    getProfileByUsername: async function (userId, profileName) {
      return await knex('users')
        .first()
        .select('users.id', 'username', 'bio', 'image')
        .count('followers.id as following')
        .leftJoin('followers', function () {
          this
            .on('followers.user', '=', 'users.id')
            .andOn('followers.follower', '=', userId)
        })
        .where({ 'users.username': profileName })
        // .groupBy('users.id')
    },

    followProfile: async function (userId, profileId) {
      const follow = {
        user: userId,
        follower: profileId
      }
      await knex('followers').insert(follow)
    },

    unfollowProfile: async function (userId, profileId) {
      await knex('followers')
        .where({ user: userId, follower: profileId })
        .del()
    }

  }
}
