const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: 'bugtracker'
  }
});

knex
  .raw('SELECT VERSION()')
  .then(version => console.log(version[0][0]))
  .catch(err => {
    console.log(err);
    throw err;
  });

module.exports = knex;
