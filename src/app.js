const express = require('express');
// const routes = require('./routes/index');
// const authRoutes = require('./modules/auth/routes/auth.routes');
// const permissionsRoutes = require('./modules/permissions/routes/PermissionRoutes');
const path = require('path');
const routes = require('./routes');
const { AppError } = require('./core/errors/AppError');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.use((req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
