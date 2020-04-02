const config = require('./config');
const { database, host, password, port, user } = config;

const knex = require('knex')({
  client: 'pg',
  connection: {
    host,
    user,
    password,
    database,
    port,
    ssl: true
  },
  pool: {
    max: 7,
    min: 0
  }
});

knex
  .raw('SELECT NOW()')
  .then(() => console.log('Connected to DB'))
  .catch(err => {
    console.log(err);
    throw err;
  });

module.exports = knex;
