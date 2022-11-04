/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  return {

    // Returns most recent articles globally by default,
    getArticles: async function (userId, filters) {
      let { offset, limit, tag, author, favorited } = filters
      userId = userId || -1
      offset = offset || 0
      limit = limit || 20

      const query = knex('articles')
        .select('articles.id', 'articles.slug', 'articles.title', 'articles.description', 'articles.body', 'articles.created_at as createdAt', 'articles.updated_at as updatedAt')
        .select('users.username', 'users.bio', 'users.image')
        .select(knex.raw('group_concat(distinct tags.name) as tagList'))
        .count('favorites.id as favoritesCount')
        .count('favorites2.id as favorited')
        .count('followers.id as following')
        .join('users', 'articles.author', 'users.id')
        .leftJoin('favorites', 'articles.id', 'favorites.article')
        .leftJoin('favorites as favorites2', function () {
          this
            .on('favorites2.article', '=', 'articles.id')
            .andOn('favorites2.user', '=', userId)
        })
        .leftJoin('followers', function () {
          this
            .on('followers.user', '=', 'users.id')
            .andOn('followers.follower', '=', userId)
        })
        .leftJoin('articles_tags', 'articles.id', 'articles_tags.article')
        .leftJoin('tags', 'articles_tags.tag', 'tags.id')
        .groupBy('articles.id', 'users.id')
        .orderBy('articles.created_at', 'desc')

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
      articles.map(article => {
        article.author = {
          username: article.username,
          bio: article.bio,
          image: article.image,
          following: !!article.following
        }
        delete article.username
        delete article.bio
        delete article.image
        delete article.following
        article.favorited = article.favorited > 0
        article.tagList = article.tagList ? article.tagList.split(',') : []
        return article
      })

      return { articles, articlesCount: parseInt(articlesCount.count) }
    },

    getArticlesFeed: async function (userId, filters) {
      const { offset, limit } = filters
      const query = knex('articles')
        .select('articles.*')
        .select('users.*')
        .count('favorites.id as favoritesCount')
        .count('followers.id as following')
        .join('users', 'articles.author', 'users.id')
        .leftJoin('favorites', 'articles.id', 'favorites.article')
        .leftJoin('favorites as favorites2', function () {
          this
            .on('favorites2.article', '=', 'articles.id')
            .andOn('favorites2.user', '=', userId)
        })
        .join('followers', function () {
          this
            .on('followers.user', '=', 'users.id')
            .andOn('followers.follower', '=', userId)
        })
        .groupBy('articles.id', 'users.id')
        .orderBy('articles.created_at', 'desc')

      const articlesCount = await query.clone().count('articles.id', { as: 'count' }).first()

      query
        .offset(offset)
        .limit(limit)

      const articles = await query
      articles.map(article => {
        article.author = {
          username: article.username,
          bio: article.bio,
          image: article.image,
          following: !!article.following
        }
        delete article.username
        delete article.bio
        delete article.image
        delete article.following
        article.favorited = !!article.favoritesCount
        delete article.favoritesCount
        return article
      })

      return { articles, articlesCount: parseInt(articlesCount.count) }
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
