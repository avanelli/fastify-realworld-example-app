# ![RealWorld Example App](logo.png)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> ### [Fastify](https://github.com/fastify/fastify) + [Knex.js](https://github.com/knex/knex) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **Fastify + Knex.js** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Fastify + Knex.js** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

## Knex and Data

The codebase makes use of in memory Sqlite3 database accessed via Knex.js

You can find [migrations](/knex/migrations/) and [seeds](/knex/seeds/) in [/knex](/knex/) folder

All the database logics are in [/models](/lib/models/) folder
## Fastify and Routes

The Fastify server is setup in [/server.js](/lib/server.js) file.

It automatically loads all the routes from [/routes](/lib/routes/) folder and plugins from [/plugins](/lib/plugins/) folder using [@fastify-autoload](https://github.com/fastify/fastify-autoload) plugin.

All routes and plugins are wrappeed inside a [fastify-plugin](https://github.com/fastify/fastify-plugin)

# Getting started

Install dependencies and create `.env` file copying `.env.example`. You can customize it.

```
npm install
npm create:env
```
Run api server

```
npm start
```
You can also start the server in developer mode with autoreload and better logs (nodemon and pino-pretty).

```
npm run dev
```
# Running API tests locally

To locally run the provided Postman collection against your backend, execute:

```
APIURL=http://localhost:5000/api ./run-api-tests.sh
```

You can also run TAP tests
```
npm test
```


# EXTRA

There is an additional endpoint to get the sentiment score of a text.

```sh
curl -d '{"content":"You have done an excellent job. Well done!"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/sentiment/score
```
# Contributing

If you find a bug please submit an Issue and, if you are willing, a Pull Request.

If you want to suggest a different best practice, style or project structure please open an issue explaining how we can improve this project. 

We need your help to make this project better and keep it up to date!

# License
MIT

