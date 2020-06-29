const router = require('express').Router();
const multer = require('multer');
const db = require('../utils/db');
const {
  uploadImage,
  deleteMultipleImages,
  deleteImage,
} = require('../utils/helpers');
const { sendGenericMail } = require('../utils/sendGrid');

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

router.get('/chart/status', async (_req, res) => {
  try {
    const query = await db('tickets')
      .count('*')
      .select('resolved as status')
      .groupBy('resolved');
    res.json(
      query.map(({ count, status }) => ({
        count: Number(count),
        status: `${!status ? 'un' : ''}resolved`,
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
    let [ticket] = await db('tickets')
      .select(
        'tickets.id as id',
        'tickets.name as name',
        'tickets.type',
        'tickets.priority',
        'tickets.resolved',
        'tickets.description',
        'tickets.imageurl',
        'projects.name as projectName',
        'projects.id as project_id',
        'tickets.dateadded',
        'users.id as user_id',
        'users.name as creator',
        'ticket_developers.developer_id as developer'
      )
      .innerJoin('projects', 'tickets.project_id', 'projects.id')
      .innerJoin('users', 'tickets.user_id', 'users.id')
      .innerJoin(
        'ticket_developers',
        'tickets.id',
        'ticket_developers.ticket_id'
      )
      .where('tickets.id', '=', id);
    if (!ticket) {
      return res.sendStatus(204);
    }
    if (ticket.developer !== null) {
      const devQuery = await db('users')
        .select('id', 'name')
        .where({ id: ticket.developer });
      ticket = { ...ticket, developer: devQuery[0] };
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
    // delete the image assets
    const assetQuery = await db('tickets')
      .select('imageurl')
      .whereIn('id', ids)
      .whereNotNull('imageurl');
    await db('tickets').whereIn('id', ids).delete();
    res.sendStatus(200);
    let links = [];
    if (assetQuery.length !== 0) {
      assetQuery.forEach(a => links.push(a.imageurl));
      deleteMultipleImages(links, 'tickets');
    }
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

router.post('/:id/assignDeveloper', async (req, res) => {
  const {
    body: { developer_id, ticket_id, developerName, sendEmail },
    currentUser: { name },
  } = req;
  try {
    await db('ticket_developers').update({ developer_id }).where({ ticket_id });
    await db('ticket_timeline').insert({
      ticket_id,
      event: `${developerName} was assigned to this ticket by ${name}`,
    });
    res.sendStatus(200);
    if (sendEmail) {
      const [user] = await db('users')
        .select('email')
        .where({ id: developer_id });
      await sendGenericMail(
        user.email,
        'Assigned to ticket',
        `You have been assigned to a ticket by ${name}`
      );
    }
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
      .where({ ticket_id: id });
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
      await db('ticket_developers').insert({ ticket_id: newTicket });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { body, currentUser } = req;
  try {
    await db('tickets').update(body).where({ id });
    // ADD TO TIMELINE
    await db('ticket_timeline').insert({
      ticket_id: id,
      event: `Ticket updated by ${currentUser.name}`,
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [link] = await db('tickets').select('imageurl').where({ id });
    await db('tickets').where({ id }).delete();
    console.log({ link });
    res.status(200).send('Success');
    deleteImage(link.imageurl, 'tickets');
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
