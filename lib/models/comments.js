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
    return comment
  }

  return {

    getComment: async function (userId, id) {
      const comments = await knex('comments')
        .select('comments.*')
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

      if (comments.length === 0) {
        return null
      }
      return comments.map(commentMap)[0]
    },

    getComments: async function (userId, slug) {
      const comments = await knex('comments')
        .select('comments.*')
        .select('users.username', 'users.bio', 'users.image')
        .count('followers.id as following')
        .join('users', 'comments.author', 'users.id')
        .join('articles', 'comments.article', 'articles.id')
        .leftJoin('followers', function () {
          this
            .on('followers.user', '=', 'users.id')
            .andOn('followers.follower', '=', userId)
        })

        .where('articles.slug', slug)
        .orderBy('comments.created_at', 'desc')

      return comments.map(commentMap)
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
      return await this.getComment(userId, newComment.id)
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
