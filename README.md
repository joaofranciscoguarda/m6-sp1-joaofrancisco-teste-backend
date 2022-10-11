
# Contact list
Contact List is a small project, with the idea to manage a list of contacts, just like the cellphone manager. Made on React + Chakra UI for front-end and NestJs + Prisma + PostgreSQL + Docker for back-end.

Back-end -> https://teste-tecnico-joaof-backend.herokuapp.com/ \
Front-end -> https://m6-sp1-joaofrancisco-teste-tecnico.vercel.app/

# Run it localy
I made a few commands to make things easier.

First you have to create .env and .env.test file, using the .env.example as example for the variables. And change the BASE_URL_API with the values passed in other variables

### Install dependencies

```
yarn #or yarn install
#or
npm i
```

### Run this commands to run dev

```
#Terminal

#Create the dev-db in your docker on port 5434, run migrations and if there is a already existing container with this name, it is removed.
yarn db:dev:restart

#To start, just run
yarn start:dev

```

### Run this commands to run test db and the tests:e2e

```
#Terminal

#Create the test-db in your docker on port 5435, run migrations and if there is a already existing container with this name, it is removed.
yarn db:test:restart

#To run the test, just run
yarn test:e2e

#To see the test covarege, just run
yarn test:e2e:cov

```
