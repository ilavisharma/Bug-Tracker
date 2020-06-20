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
  try {
    const query = await db('tickets')
      .select('id', 'name', 'type', 'priority')
      .orderBy('dateadded', 'desc')
      .limit(5);
    res.json(query);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/chart/priority', async (_req, res) => {
  try {
    const query = await db('tickets')
      .count('*')
      .select('priority')
      .groupBy('priority');
    res.json(
      query.map(row => ({
        ...row,
        count: Number(row.count),
      }))
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/chart/type', async (_req, res) => {
  try {
    const query = await db('tickets').count('*').select('type').groupBy('type');
    res.json(
      query.map(({ count, type }) => ({
        type: type + 's',
        count: Number(count),
      }))
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [ticket] = await db('tickets')
      .select(
        'tickets.id as id',
        'tickets.name as name',
        'tickets.type',
        'tickets.priority',
        'tickets.resolved',
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
    if (!ticket) {
      return res.sendStatus(204);
    }
    res.json(ticket);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const query = await db('ticket_comments')
      .select(
        'ticket_comments.content',
        'ticket_comments.id as id',
        'users.photourl',
        'users.name',
        'ticket_comments.dateadded',
        'users.id as user_id'
      )
      .innerJoin('users', 'users.id', 'ticket_comments.user_id')
      .where({ ticket_id: id })
      .orderBy('ticket_comments.dateadded', 'desc');
    res.json(query);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put('/:id/changeStatus', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db('tickets').update({ resolved: status }).where({ id });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/deleteMultiple', async (req, res) => {
  const { ids } = req.body;
  try {
    await db('tickets').whereIn('id', ids).delete();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/:id/comments/new', async (req, res) => {
  const { id: ticket_id } = req.params;
  const { content } = req.body;
  const { id: user_id } = req.currentUser;
  try {
    await db('ticket_comments').insert({
      ticket_id,
      content,
      user_id,
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db('ticket_comments').where({ id }).delete();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/:id/timeline', async (req, res) => {
  const { id } = req.params;
  try {
    const query = await db('ticket_timeline')
      .select('*')
      .where({ ticket_id: id })
      .orderBy('date', 'desc');
    res.json(query);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/new', async (req, res) => {
  const { currentUser } = req;
  if (currentUser) {
    try {
      const [newTicket] = await db('tickets')
        .insert({
          ...req.body,
          user_id: currentUser.id,
        })
        .returning('id');
      // add new event to ticket timeline
      await db('ticket_timeline').insert({
        ticket_id: newTicket,
        event: `Ticket created by ${currentUser.name}`,
      });
      // send response
      res.json({ id: newTicket });
      // add this event to project timeline also
      await db('project_timeline').insert({
        project_id: req.body.project_id,
        event: `Ticket created by ${currentUser.name}`,
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
    await db('tickets').where({ id }).delete();
    res.status(200).send('Success');
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
