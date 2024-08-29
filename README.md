# 📋 Daily Diet
I developed this project as a challenge of my latest studies on Node lessons at [Rocketseat](https://www.rocketseat.com.br).

## 🚀 Techs and Tools
- [Node.js v18](https://nodejs.org/)
- [Fastify](https://fastify.dev)
- [Knex](https://knexjs.org/)
- [SQLite](https://www.sqlite.org) / [PostgreSQL](https://www.postgresql.org/)
- [Insomnia](https://insomnia.rest/)
- [Vitest](https://vitest.dev/)

## 💻 Project
This project was developed to practice the development of a API REST in Node.js with Fastify. It was applied E2E tests on routes using Vitest along with supertest to make requests. Knex was used as query builder alongside with SQLite database on development enviroment and PostgreSQL on production. 

To get started with the api flow, you'll have to create a new user before managing with the meals, this app hasn't a authentication system, so it will be used a simple cookie session to identify the active user (created during user creation).

## ⚙️ Installation
Setup enviroment variables and run:
```shell
npm i
npm run knex -- migrate:latest 
npm run dev
```

## 🔗 Routes
<!-- Add URLINHERE.JSON to insominia collection -->
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Node.js%3A%20Daily%20Diet%0A&uri=URLINHERE.JSON)

| Method     | Route          | Params/Body                             |
| ---------- | -------------- | ----------------------------------------|
| ``POST``   | /users/        | name, email                             |
| ``GET``    | /users/        | -                                       |


| Method     | Route          | Params/Body                             |
| ---------- | -------------- | ----------------------------------------|
| ``GET``    | /meals/        | -                                       |
| ``GET``    | /meals/:id     | -                                       |
| ``POST``   | /meals/        | name, description, is_on_diet, eated_at |
| ``PUT``    | /meals/:id     | name, description, is_on_diet, eated_at |
| ``DELETE`` | /meals/:id     | -                                       |
| ``GET``    | /meals/summary | -                                       |


## 🔖 Business Rules
- [x] It should be possible to create a user
- [x] It should be possible to identify the user between requests
- [x] It should be possible to register a meal with: user id, name, description, date and time, it's in diet or not
- [x] It should be possible to edit a meal with all data listed above.
- [x] It should be possible to delete a meal
- [x] It should be possible to list all user meals
- [x] It should be possible to show a specific meal
- [ ] It should be possible to retrieve summary metrics containing:
    - [x] Number of all meals registered
    - [x] Number of all meals respecting the diet
    - [x] Number of all meals out of diet
    - [ ] Better sequence of meals on diet
- [x] The user should be able to show, edit and delete meals created by theirs