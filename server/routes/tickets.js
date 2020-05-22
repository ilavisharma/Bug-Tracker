const router = require('express').Router();
const multer = require('multer');
const db = require('../utils/db');
const { uploadImage } = require('../utils/helpers');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (_req, res) => {
  try {
    const query = await db('tickets')
      .select(
        'tickets.id as id',
        'tickets.name as name',
        'tickets.type',
        'tickets.priority',
        'projects.name as projectName',
        'tickets.dateadded',
        'users.name as user'
      )
      .innerJoin('projects', 'tickets.project_id', 'projects.id')
      .innerJoin('users', 'tickets.user_id', 'users.id')
      .orderBy('tickets.dateadded', 'desc');
    res.json(query).status(200);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Unable to fetch projects' }).status(500);
  }
});

router.get('/recent', async (_req, res) => {
  const query = await db('tickets')
    .select('id', 'name', 'type', 'priority')
    .orderBy('dateadded', 'desc')
    .limit(5);
  res.json(query);
});

router.get('/chart/priority', async (_req, res) => {
  const query = await db('tickets')
    .count('*')
    .select('priority')
    .groupBy('priority');
  res.json({
    labels: query.map(l => l.priority),
    data: query.map(d => Number(d.count))
  });
});

router.get('/chart/type', async (_req, res) => {
  const query = await db('tickets')
    .count('*')
    .select('type')
    .groupBy('type');
  res.json({
    labels: query.map(l => l.type),
    data: query.map(d => Number(d.count))
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = await db('tickets')
      .select(
        'tickets.id as id',
        'tickets.name as name',
        'tickets.type',
        'tickets.priority',
        'tickets.description',
        'tickets.imageurl',
        'projects.name as projectName',
        'tickets.dateadded',
        'users.id as user_id',
        'users.name as creator'
      )
      .innerJoin('projects', 'tickets.project_id', 'projects.id')
      .innerJoin('users', 'tickets.user_id', 'users.id')
      .where('tickets.id', '=', id);
    if (query.length === 0) {
      res.sendStatus(204);
    } else {
      res.json(query[0]);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/:id/timeline', async (req, res) => {
  const { id } = req.params;
  const query = await db('ticket_timeline')
    .select('*')
    .where({ ticket_id: id })
    .orderBy('date', 'desc');
  res.json(query);
});

router.post('/new', async (req, res) => {
  const { currentUser } = req;
  if (currentUser) {
    try {
      const query = await db('tickets')
        .insert({
          ...req.body,
          user_id: currentUser.id
        })
        .returning('id');
      // add new event to ticket timeline
      await db('ticket_timeline').insert({
        ticket_id: query[0],
        event: `Ticket created by ${currentUser.name}`
      });
      // send response
      res.json({ id: query[0] });
      // add this event to project timeline also
      await db('project_timeline').insert({
        project_id: req.body.project_id,
        event: `Ticket created by ${currentUser.name}`
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    db('tickets')
      .where({ id })
      .delete()
      .then(() => res.status(200).send('Success'));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/uploadImage', upload.single('file'), async (req, res) => {
  try {
    const url = await uploadImage(req.file, 'tickets');
    res.json({ url });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
