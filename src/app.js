const express = require('express');
const routes = require('./routes');
const { AppError } = require('./core/errors/AppError');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use((req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});
app.use(errorHandler);

module.exports = app;
