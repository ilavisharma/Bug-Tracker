const router = require('express').Router();
const db = require('../utils/db');
const { sendToNewManager } = require('../utils/sendGrid');

router.get('/', async (_, res) => {
  try {
    const query = await db('projects')
      .select(
        'projects.id as id',
        'projects.name as name',
        'users.name as manager',
        'projects.dateadded as dateadded'
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
      const [id] = await db('projects')
        .insert({
          user_id: currentUser.id,
          ...req.body,
        })
        .returning('id');
      // aslo create a record in project_managers with manager as null
      await db('project_managers').insert({
        manager_id: null,
        project_id: id,
      });
      await db('project_timeline').insert({
        project_id: id,
        event: `${currentUser.name} created the project`,
      });
      res.json({ id }).status(201);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
});

router.post('/deleteMultiple', async (req, res) => {
  const { ids } = req.body;
  try {
    await db('projects').whereIn('id', ids).delete();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/chart', async (_req, res) => {
  const query = await db.raw(
    "SELECT date_trunc('month', dateadded) AS month, count(*) FROM projects GROUP BY 1"
  );
  const rows = query.rows
    .map(r => {
      return {
        count: Number(r.count),
        month: new Date(r.month).getMonth() + 1,
      };
    })
    .sort((f, s) => f.month - s.month);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  res.json(
    Array.from(
      Array(12).keys(),
      month =>
        rows.find(row => +row.month === month + 1) || {
          month: Number(('0' + (month + 1)).substr(-2)),
          count: 0,
        }
    ).map(({ month, count }) => ({
      count,
      month: months[month - 1],
    }))
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
          manager: managerQuery[0],
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

router.get('/:id/tickets', async (req, res) => {
  const { id } = req.params;
  const query = await db('tickets')
    .select('id', 'name', 'dateadded')
    .where({ project_id: id });
  res.json(query);
});

router.get('/:id/developers', async (req, res) => {
  const { id } = req.params;
  const query = await db('project_developers')
    .select('users.id as user_id', 'users.photourl', 'users.name')
    .innerJoin('users', 'users.id', 'project_developers.developer_id')
    .where({ project_id: id });
  res.json(query);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db('projects')
    .where({ id })
    .delete()
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
  res.sendStatus(200);
});

router.put('/assignManager', async (req, res) => {
  const { manager_id, project_id, project_name } = req.body;
  const { currentUser } = req;
  if ((currentUser.role = 'admin' || currentUser.role === 'manager')) {
    try {
      await db('project_managers').update({ manager_id }).where({ project_id });
      const [user] = await db('users')
        .select('name', 'email')
        .where({ id: manager_id });
      await db('project_timeline').insert({
        project_id,
        event: `${user.name} was assigned as manager by ${currentUser.name}`,
      });
      res.sendStatus(200);
      await sendToNewManager(
        user.email,
        user.name,
        project_name,
        currentUser.name,
        project_id
      ).catch(e => JSON.stringify(e));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
  }
});

router.put('/:id/assignDeveloper', async (req, res) => {
  const data = req.body;
  try {
    await db('project_developers').insert(data);
    res.sendStatus(200);
    // TODO: SEND EMAIL TO THE DEVELOPER
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put('/:id/removeDevelopers', async (req, res) => {
  const data = req.body;
  try {
    await db('project_developers').whereIn('developer_id', data).delete();
    // TODO: send email to developer
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    currentUser: { name },
  } = req;
  try {
    await db('projects').where({ id }).update(req.body);
    res.sendStatus(200);
    await db('project_timeline').insert({
      project_id: id,
      event: `${name} updated the project details`,
    });
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
