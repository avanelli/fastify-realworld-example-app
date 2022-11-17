const slug = require('slug')

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
    article.tagList.sort()
    article.updatedAt = new Date(article.updatedAt).toISOString()
    article.createdAt = new Date(article.createdAt).toISOString()
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
        .groupBy('articles.id')

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
      if (typeof totalCount === 'undefined') {
        return { articles: [], articlesCount: 0 }
      }
      query
        .select('articles.id', 'articles.slug', 'articles.title', 'articles.description', 'articles.body', 'articles.created_at as createdAt', 'articles.updated_at as updatedAt')
        .select('users.username', 'users.bio', 'users.image')
        .select(knex.raw('group_concat(distinct tags.name) as tagList'))
        .count('favorites.id as favoritesCount')
        .count('favorites2.id as favorited')
        .count('followers.id as following')
        .offset(offset)
        .limit(limit)

      const articles = await query
      articles.map(articleMap)
      return { articles, articlesCount: totalCount.count || 0 }
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

    getArticle: async function (userId, slug) {
      const query = knex('articles')
        .leftJoin('users', 'articles.author', 'users.id')
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
        .where('articles.slug', slug)
        .orderBy('articles.created_at', 'desc')

      query
        .select('articles.id', 'articles.slug', 'articles.title', 'articles.description', 'articles.body', 'articles.created_at as createdAt', 'articles.updated_at as updatedAt')
        .select('users.username', 'users.bio', 'users.image')
        .select(knex.raw('group_concat(distinct tags.name) as tagList'))
        .count('favorites.id as favoritesCount')
        .count('favorites2.id as favorited')
        .count('followers.id as following')
        .groupBy('articles.id', 'users.id')

      const articles = await query
      articles.map(articleMap)
      return articles[0] || null
    },

    createArticle: async function (userId, article) {
      // TODO get tags and insert them
      const tagList = article.tagList
      delete article.tagList
      article.author = userId
      article.slug = slug(article.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
      const newArticle = await knex('articles').insert(article).returning('id')

      // insert tags
      if (tagList && tagList.length > 0) {
        const tags = await knex('tags')
          .whereIn('name', tagList)
          .select('id', 'name')
        const tagsToInsert = tagList
          .filter(tag => !tags.find(t => t.name === tag))
          .map(tag => ({ name: tag }))
        if (tagsToInsert.length > 0) {
          await knex('tags').insert(tagsToInsert)
        }
        const tagsToInsertIds = await knex('tags')
          .select('id')
          .whereIn('name', tagList)
        const articlesTags = tagsToInsertIds.map(tagId => ({
          article: newArticle[0].id,
          tag: tagId.id
        }))
        await knex('articles_tags')
          .insert(articlesTags)
      }

      // get the article
      return this.getArticle(userId, article.slug)
    },

    updateArticle: async function (userid, slug, article) {
      if (article.title) {
        article.slug = slug(article.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
      }
      await knex('articles')
        .update(article)
        .where('slug', slug)
        .where('author', userid)
      return this.getArticle(userid, slug)
    },

    deleteArticle: async function (userid, slug) {
      const article = await knex('articles')
        .select('id')
        .where('slug', slug)
        .where('author', userid)
        .first()
      if (!article) {
        return null
      }

      await Promise.all([
        knex('articles')
          .where('id', article.id)
          .del(),
        knex('articles_tags')
          .where('article', article.id)
          .del(),
        knex('favorites')
          .where('article', article.id)
          .del(),
        knex('comments')
          .where('article', article.id)
          .del()
      ])
      return article
    },

    favoriteArticle: async function (userId, slug) {
      const article = await knex('articles')
        .select('id')
        .where('slug', slug)
        .first()
      if (!article) {
        return null
      }

      const favorite = await knex('favorites')
        .select('id')
        .where('article', article.id)
        .where('user', userId)
        .first()
      if (!favorite) {
        await knex('favorites')
          .insert({ article: article.id, user: userId })
      }
      return this.getArticle(userId, slug)
    },

    unfavoriteArticle: async function (userId, slug) {
      const article = await knex('articles')
        .select('id')
        .where('slug', slug)
        .first()
      if (!article) {
        return null
      }

      await knex('favorites')
        .where('article', article.id)
        .where('user', userId)
        .del()

      return this.getArticle(userId, slug)
    }

  }
}
