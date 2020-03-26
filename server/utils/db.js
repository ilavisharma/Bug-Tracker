const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: 'bugtracker'
  },
  debug: false,
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
