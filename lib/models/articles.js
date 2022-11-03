/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  return {

    // Returns most recent articles globally by default,
    getArticles: async function (filters) {
      const { offset, limit, tag, author, favorited } = filters
      const query = knex('articles')
        .select('articles.*')
        .count('favorites.id as favoritesCount')
        .join('users', 'articles.author', 'users.id')
        .leftJoin('favorites', 'articles.id', 'favorites.article')
        .groupBy('articles.id', 'users.id')

      if (tag) {
        query
          .join('articles_tags', 'articles.id', 'articles_tags.article')
          .join('tags', 'articles_tags.tag', 'tags.id')
          .where('tags.name', tag)
      }

      if (author) {
        query
          .where('users.username', author)
      }

      if (favorited) {
        query
          .join('favorites', 'articles.id', 'favorites.article')
          .join('users', 'favorites.user', 'users.id')
          .where('users.username', favorited)
      }

      const articlesCount = await query.clone().count('articles.id', { as: 'count' }).first()

      query
        .offset(offset)
        .limit(limit)

      const articles = await query

      return { articles, articlesCount: parseInt(articlesCount.count) }
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

    createArticle: async function (userid, article) {
      return await knex('articles')
        .insert(article)
        .returning('*')
        .first()
    },

    updateArticle: async function (userid, slug, article) {
      return await knex('articles')
        .update(article)
        .where('slug', slug)
        .where('author', userid)
        .returning('*')
        .first()
    },

    deleteArticle: async function (userid, slug) {
      return await knex('articles')
        .where('slug', slug)
        .where('author', userid)
        .del()
    }

  }
}
