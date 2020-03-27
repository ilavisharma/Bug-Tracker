const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
const PORT = process.env.PORT || 4000;

app.use('/projects', projectRoutes);
app.use('/auth', authRoutes);

app.get('/', (_, res) => {
  res.send('API is working').status(200);
});

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
