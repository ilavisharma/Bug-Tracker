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
      // aslo create a record in project_managers with manager as null
      await db('project_managers').insert({
        manager_id: null,
        project_id: query[0]
      });
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
  const { id } = req.params;
  try {
    // TODO: fetch details of the project with user who created it
    const query = await db('projects')
      .select('*')
      .innerJoin(
        'project_managers',
        'projects.id',
        'project_managers.project_id'
      )
      .where({ id });
    // TODO: fetch the project manager details
    const managerQuery = await db('users')
      .select('name')
      .where({ id: query[0].manager_id });

    if (query.length === 0) {
      res.sendStatus(204);
    } else {
      if (managerQuery.length === 0) res.send({ ...query[0], manager: null });
      else res.send({ ...query[0], manager: managerQuery[0].name });
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

router.post('/assign', async (req, res) => {
  const {} = req.body;
});

module.exports = router;
