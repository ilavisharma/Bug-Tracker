const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger.yaml');
const { verifyToken } = require('./utils/helpers');
const db = require('./utils/db');

const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
const PORT = process.env.PORT || 4000;

app.use((req, _, next) => {
  const token = req.headers['authorization'];
  if (token !== 'null') {
    try {
      const currentUser = verifyToken(token);
      req.currentUser = currentUser;
    } catch (e) {}
  }
  next();
});

app.use('/static', express.static('public'));
app.use('/projects', projectRoutes);
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.on('ready', () => {
  app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}`)
  );
});

db.raw('SELECT NOW()')
  .then(() => {
    console.log('Connected to DB');
    app.emit('ready');
  })
  .catch(err => {
    console.log(err);
    app.emit('ready');
  });
