const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('HELLOI');
});

app.listen(8000);
