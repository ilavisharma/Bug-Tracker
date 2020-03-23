const router = require('express').Router();
const db = require('../utils/db');

router.get('/', async (_, res) => {
  try {
    const query = await db('projects').select('*');
    res.json(query).status(200);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Project creation failed' }).status(500);
  }
});

router.post('/new', async (req, res) => {
  try {
    const query = await db('projects').insert(req.body);
    res.json({ id: query[0] }).status(200);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Project creation failed' }).status(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const query = await db('projects')
      .select('*')
      .where('id', '=', req.params.id);
    res.json(query).status(200);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Unable to fetch the projects' }).status(500);
  }
});

module.exports = router;
