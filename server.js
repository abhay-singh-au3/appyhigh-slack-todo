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
  const { channel_name, text, user_name } = req.body;
  if (tasks.get(channel_name) === undefined) {
    tasks.set(channel_name, [text]);
  } else {
    tasks.get(channel_name).push(text);
  }
  res.json({
    response_type: 'in_channel',
    text: `Task added ${text}`,
  });
});

app.post('/slack/command/listtasks', (req, res) => {
  const { channel_name } = req.body;
  let list = tasks.get(channel_name);
  if (list === undefined || list.length < 1) {
    res.json({
      response_type: 'in_channel',
      text: 'Todos list of this channel is empty',
    });
  } else {
    list = list.length > 1 ? list.join('\n') : list[0];
    res.json({
      response_type: 'in_channel',
      text: list,
    });
  }
});

app.post('/slack/command/marktask', (req, res) => {
  const { channel_name, text } = req.body;
  let list = tasks.get(channel_name);
  if (list === undefined || list.length < 1) {
    res.json({
      response_type: 'in_channel',
      text: 'Todos list of this channel is empty',
    });
  } else {
    if (list.includes(text)) {
      list.splice(list.indexOf(text), 1);
      tasks.set(channel_name, list);
      res.json({
        response_type: 'in_channel',
        text: `Removed task from todo ${text}`,
      });
    } else {
      res.json({
        response_type: 'in_channel',
        text: `${text} has not been added to the todo of this channel yet`,
      });
    }
  }
});

app.listen(PORT);
