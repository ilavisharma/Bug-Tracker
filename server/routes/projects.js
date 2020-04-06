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
  const { currentUser } = req;
  if (currentUser) {
    try {
      const query = await db('projects')
        .insert({
          user_id: currentUser.id,
          ...req.body
        })
        .returning('id');
      res.json({ id: query[0] }).status(201);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const query = await db('projects')
      .select('*')
      .where('id', '=', req.params.id);
    if (query.length === 0) {
      res.sendStatus(204);
    } else {
      res.json(query[0]).status(200);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    db('projects')
      .where({ id })
      .update(req.body)
      .then(() => res.status(200).send('Success'));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db('projects')
      .where({ id })
      .delete()
      .then(() => res.status(200).send('Success'));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
