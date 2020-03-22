const express = require('express');
const cors = require('cors');

const projectRoutes = require('./routes/project');

const app = express();

app.use(cors());
const PORT = process.env.PORT || 4000;

app.use('/projects', projectRoutes);

app.get('/', (_, res) => {
  res.send('API is working').status(200);
});

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
