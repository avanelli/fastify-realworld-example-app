/**
 * @param { import("knex").Knex } knex
 */
module.exports = function (knex) {
  function articleMap (article) {
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
  }

  return {

    // Returns most recent articles globally by default,
    getArticles: async function (userId, filters) {
      let { offset, limit, tag, author, favorited } = filters
      userId = userId || -1
      offset = offset || 0
      limit = limit || 20

      const query = knex('articles')
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

        .orderBy('articles.created_at', 'desc')

      if (tag) {
        query
          .join('articles_tags as articles_tags_tag', 'articles.id', 'articles_tags_tag.article')
          .join('tags as tags_tag', 'articles_tags_tag.tag', 'tags_tag.id')
          .where('tags_tag.name', tag)
      }

      if (author) {
        query
          .where('users.username', author)
      }

      if (favorited) {
        query
          .join('favorites as favorites_fav', 'articles.id', 'favorites_fav.article')
          .join('users as users_fav', 'favorites_fav.user', 'users_fav.id')
          .where('users_fav.username', favorited)
      }

      const totalCount = await query.clone().count('*', { as: 'count' }).first()
      query
        .select('articles.id', 'articles.slug', 'articles.title', 'articles.description', 'articles.body', 'articles.created_at as createdAt', 'articles.updated_at as updatedAt')
        .select('users.username', 'users.bio', 'users.image')
        .select(knex.raw('group_concat(distinct tags.name) as tagList'))
        .count('favorites.id as favoritesCount')
        .count('favorites2.id as favorited')
        .count('followers.id as following')
        .groupBy('articles.id', 'users.id')
        .offset(offset)
        .limit(limit)

      const articles = await query
      articles.map(articleMap)
      return { articles, articlesCount: totalCount.count }
    },

    getArticlesFeed: async function (userId, filters) {
      const offset = filters.offset || 0
      const limit = filters.limit || 20

      const query = knex('articles')
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
        .leftJoin('articles_tags', 'articles.id', 'articles_tags.article')
        .leftJoin('tags', 'articles_tags.tag', 'tags.id')
        .orderBy('articles.created_at', 'desc')

      const totalCount = await query.clone().count('*', { as: 'count' }).first()
      query
        .select('articles.id', 'articles.slug', 'articles.title', 'articles.description', 'articles.body', 'articles.created_at as createdAt', 'articles.updated_at as updatedAt')
        .select('users.username', 'users.bio', 'users.image')
        .select(knex.raw('group_concat(distinct tags.name) as tagList'))
        .count('favorites.id as favoritesCount')
        .count('favorites2.id as favorited')
        .count('followers.id as following')
        .groupBy('articles.id', 'users.id')
        .offset(offset)
        .limit(limit)

      const articles = await query
      articles.map(articleMap)
      return { articles, articlesCount: totalCount.count }
    },

    getArticle: async function (slug) {
      return await knex('articles')
        .select('articles.*', 'users.username', 'users.image')
        .leftJoin('users', 'users.id', 'articles.author')
        .where('articles.slug', slug)
        .first()
    },

    createArticle: async function (userId, article) {
      // TODO get tags and insert them

      article.author = userId
      return await knex('articles')
        .insert(article)
        .returning('*')
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
