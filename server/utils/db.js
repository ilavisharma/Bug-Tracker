const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: 'bugtracker'
  },
  debug: false
});

knex
  .raw('SELECT NOW()')
  .then(data => console.log(new Date(data[0][0]['NOW()']).toTimeString()))
  .catch(err => {
    console.log(err);
    throw err;
  });

module.exports = knex;
