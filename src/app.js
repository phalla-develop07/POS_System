const express = require('express');
const routes = require('./routes/index');
// const authRoutes = require('./modules/auth/routes/auth.routes');
// const permissionsRoutes = require('./modules/permissions/routes/PermissionRoutes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
// app.use('/auth', authRoutes);
// app.use('/permissions', permissionsRoutes);
app.use(errorHandler);

module.exports = app;
