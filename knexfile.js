// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const configs = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:' // use './dev.sqlite3' to persist data
    },
    migrations: {
      directory: './knex/migrations'
    },
    seeds: {
      directory: './knex/seeds'
    },
    useNullAsDefault: true
  }

  /*
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
*/
}

module.exports = configs
