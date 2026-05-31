const express = require('express');
const path = require('path');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
