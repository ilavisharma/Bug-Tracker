const router = require('express').Router();
const multer = require('multer');
const db = require('../utils/db');
const { uploadImage } = require('../utils/helpers');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const query = await db('tickets')
      .select(
        'tickets.id as id',
        'tickets.name as name',
        'tickets.type',
        'tickets.priority',
        'projects.name as projectName',
        'tickets.dateadded'
      )
      .innerJoin('projects', 'tickets.project_id', 'projects.id')
      .orderBy('tickets.dateadded', 'desc');
    res.json(query).status(200);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Unable to fetch projects' }).status(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const query = await db('tickets')
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

router.post('/new', async (req, res) => {
  try {
    const query = await db('tickets')
      .insert({
        dateadded: db.fn.now(),
        ...req.body
      })
      .returning('id');
    console.log(query);
    res.json({ id: query[0].id });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/uploadImage', upload.single('file'), async (req, res) => {
  try {
    const url = await uploadImage(req.file);
    res.json({ url });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
