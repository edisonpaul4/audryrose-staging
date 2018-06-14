// require('newrelic');
const express = require('express');
const path = require('path');
const app = express();
const compression = require('compression');

app.use(compression());
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(9000);
