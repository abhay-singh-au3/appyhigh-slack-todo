const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const tasks = new Map();

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('HELLOI');
});

app.post('/slack/command/addtask', (req, res) => {
  const { channel_name, text } = req.body;
  if (tasks.get(channel_name) === undefined) {
    tasks.set(channel_name, [text]);
  } else {
    tasks.get(channel_name).push(text);
  }
  res.json({
    response_type: 'ephemeral',
    text: `Task added ${text}`,
  });
});

app.post('/slack/command/listtasks', (req, res) => {
  const { channel_name } = req.body;
  let list = tasks.get(channel_name);
  if (list === undefined) {
    res.json({
      response_type: 'ephemeral',
      text: 'Nothing yet added to the todos of this channel',
    });
  } else {
    list = list.length > 1 ? list.join('\n') : list[0];
    res.json({
      response_type: 'ephemeral',
      text: list,
    });
  }
});

app.post('/slack/command/marktask', (req, res) => {
  const { channel_name, text } = req.body;
  let list = tasks.get(channel_name);
  list.splice(list.indexOf(text), 1);
  tasks.set(channel_name, list);
});

app.listen(PORT);
