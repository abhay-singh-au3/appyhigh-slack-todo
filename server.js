const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('HELLOI');
});

app.post('/slack/command/addtask', (req, res) => {
  const text = `Task added ${req.body.text}`;
  res.json({
    response_type: 'ephemeral',
    test: text,
  });
});

app.listen(PORT);
