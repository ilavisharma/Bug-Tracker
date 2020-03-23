const router = require('express').Router();

router.get('/', (_, res) => {
  res.json({ project: 'something something' }).status(200);
});

router.post('/new', (req, res) => {
  console.log(req.body);
  res.json({ project: 'something something' }).status(200);
});

module.exports = router;
