const router = require('express').Router();
const db = require('../utils/db');

router.get('/', async (_, res) => {
  try {
    const query = await db('projects').select('*');
    res.json(query).status(200);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Unable to fetch projects' }).status(500);
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
      .select('name', 'description')
      .where('id', '=', req.params.id);
    if (query.length === 0) {
      res.status(204).send({ message: 'No Content' });
    } else {
      res.json(query[0]).status(200);
    }
  } catch (err) {
    console.log(err);
    res.json({ message: 'Unable to fetch the projects' }).status(500);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = await db('projects')
      .where({ id })
      .delete();
  } catch (err) {
    console.log(err);
    res.json({ message: 'Unable to delete the projects' }).status(500);
  }
});

module.exports = router;
