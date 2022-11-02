/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  return {

    // Returns most recent articles globally by default,
    getArticles: async function () {
      return await knex('articles')
        .select('articles.*', 'users.username', 'users.image')
        .leftJoin('users', 'users.id', 'articles.author')

      // TODO add date to table        .orderBy('articles.createdAt', 'desc')
    },

    getArticlesFeed: async function (currid) {
      // TODO: Can also take limit and offset query parameters like List Articles
      // Authentication required, will return multiple articles created by followed users, ordered by most recent first.
      return await knex('articles')
        .select('articles.*', 'users.username', 'users.image')
        .leftJoin('users', 'users.id', 'articles.author')
        .where('articles.author', currid)
    },

    getArticle: async function (slug) {
      return await knex('articles')
        .select('articles.*', 'users.username', 'users.image')
        .leftJoin('users', 'users.id', 'articles.author')
        .where('articles.slug', slug)
        .first()
    },

    createArticle: async function (article) {
      return await knex('articles')
        .insert(article)
        .returning('*')
        .first()
    },

    updateArticle: async function (slug, article) {
      return await knex('articles')
        .update(article)
        .where('slug', slug)
        .returning('*')
        .first()
    },

    deleteArticle: async function (slug) {
      return await knex('articles')
        .where('slug', slug)
        .del()
    }

  }
}
