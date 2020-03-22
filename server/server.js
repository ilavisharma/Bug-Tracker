const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());

const PORT = process.env.PORT || 4000;

app.get('/', (_, res) => {
  res.json({
    status: 'OK',
    Message: 'Server is fine'
  });
});

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
