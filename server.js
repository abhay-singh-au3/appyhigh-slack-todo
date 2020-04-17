const express = require('express');
const app = express();
const moment = require('moment');

const PORT = process.env.PORT || 8000;
const tasks = new Map();
const { find } = require('./utils');

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('HELLOI');
});

app.post('/slack/command/addtask', (req, res) => {
  const { channel_name, text, user_name } = req.body;
  const time = moment().format('MMMM Do YYYY, h:mm:ss a');
  if (tasks.get(channel_name) === undefined) {
    tasks.set(channel_name, [`${text} created by ${user_name} at ${time}`]);
  } else {
    tasks.get(channel_name).push(`${text} created by ${user_name}`);
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
    const index = find(list, text);
    if (index != false) {
      list.splice(index, 1);
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
