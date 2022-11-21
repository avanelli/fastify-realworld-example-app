/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  function commentMap (comment) {
    comment.author = {
      username: comment.username,
      bio: comment.bio,
      image: comment.image,
      following: !!comment.following
    }
    delete comment.username
    delete comment.bio
    delete comment.image
    delete comment.following
    comment.updatedAt = new Date(comment.updatedAt).toISOString()
    comment.createdAt = new Date(comment.createdAt).toISOString()
    return comment
  }

  return {

    getComment: async function (userId, id) {
      const comments = await knex('comments')
        .select('comments.id', 'comments.body', 'comments.created_at as createdAt', 'comments.updated_at as updatedAt')
        .select('users.username', 'users.bio', 'users.image')
        .count('followers.id as following')
        .join('users', 'comments.author', 'users.id')
        .join('articles', 'comments.article', 'articles.id')
        .leftJoin('followers', function () {
          this
            .on('followers.user', '=', 'users.id')
            .andOn('followers.follower', '=', userId)
        })
        .where({ 'comments.id': id })
        .groupBy('comments.id')

      if (comments.length === 0) {
        return null
      }
      return comments.map(commentMap)[0]
    },

    getComments: async function (userId, slug) {
      const query = knex('comments')
        .select('comments.id', 'comments.body', 'comments.created_at as createdAt', 'comments.updated_at as updatedAt')
        .select('users.username', 'users.bio', 'users.image')
        .join('users', 'comments.author', 'users.id')
        .join('articles', 'comments.article', 'articles.id')
      if (userId) {
        query.count('followers.id as following')
          .leftJoin('followers', function () {
            this
              .on('followers.user', '=', 'users.id')
              .andOn('followers.follower', '=', userId)
          })
      } else {
        query.select(knex.raw('0 as following'))
      }

      query.where('articles.slug', slug)
        .orderBy('comments.created_at', 'desc')

      const comments = await query
      if (comments.length > 0 && comments[0].id) {
        return comments.map(commentMap)
      } else {
        return []
      }
    },

    createComment: async function (userId, slug, comment) {
      const articleId = await knex('articles')
        .select('id')
        .where({ slug })
        .first()

      if (!articleId) {
        return null
      }
      comment.author = userId
      comment.article = articleId.id

      const newComment = await knex('comments')
        .returning('id')
        .insert(comment)
      return await this.getComment(userId, newComment[0].id)
    },

    deleteComment: async function (userId, commentId) {
      const comment = await knex('comments')
        .where({ id: commentId })
        .where({ author: userId })
        .first()
      if (!comment) {
        return null
      }
      await knex('comments')
        .where({ id: commentId })
        .where({ author: userId })
        .del()
      return comment
    }
  }
}
