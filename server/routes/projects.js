const router = require('express').Router();
const db = require('../utils/db');

router.get('/', async (_, res) => {
  try {
    const query = await db('projects')
      .select(
        'projects.id as id',
        'projects.name as name',
        'users.name as manager'
      )
      .innerJoin(
        'project_managers',
        'projects.id',
        'project_managers.project_id'
      )
      .leftJoin('users', 'users.id', 'project_managers.manager_id');
    res.json(query);
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
      await db('project_timeline').insert({
        project_id: query[0],
        event: `${currentUser.name} created the project`
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

router.get('/chart', async (req, res) => {
  const query = await db.raw(
    "SELECT date_trunc('month', dateadded) AS month, count(*) FROM projects GROUP BY 1"
  );
  const rows = query.rows
    .map(r => {
      return {
        count: Number(r.count),
        month: new Date(r.month).getMonth() + 1
      };
    })
    .sort((f, s) => f.month - s.month);

  res.json(
    Array.from(
      Array(12).keys(),
      month =>
        rows.find(row => +row.month === month + 1) || {
          month: Number(('0' + (month + 1)).substr(-2)),
          count: 0
        }
    ).map(x => x.count)
  );
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
    const managerQuery = await db('users')
      .select('name', 'email')
      .where({ id: query[0].manager_id });
    if (query.length === 0) {
      res.sendStatus(204);
    } else {
      if (managerQuery.length === 0) res.send({ ...query[0], manager: null });
      else
        res.send({
          ...query[0],
          manager: managerQuery[0]
        });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/:id/timeline', async (req, res) => {
  const { id } = req.params;
  const query = await db('project_timeline')
    .select('*')
    .where({ project_id: id });
  res.json(query);
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

router.put('/assignManager', async (req, res) => {
  const { manager_id, project_id } = req.body;
  const { currentUser } = req;
  if ((currentUser.role = 'admin' || currentUser.role === 'manager')) {
    try {
      await db('project_managers')
        .update({ manager_id })
        .where({ project_id });
      const query = await db('users')
        .select('name')
        .where({ id: manager_id });
      await db('project_timeline').insert({
        project_id,
        event: `${query[0].name} was assigned as manager by ${currentUser.name}`
      });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
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

router.get('/manager/:id', async (req, res) => {
  const { currentUser } = req;
  if (currentUser.role === 'manager') {
    try {
      const query = await db('project_managers')
        .select('id', 'name')
        .innerJoin('projects', 'project_managers.project_id', 'projects.id')
        .where({ manager_id: req.params.id });
      res.json(query);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
