const authRoutes = require('./auth');

const routes = (app) => {
  app.use('/api/v1/auth', authRoutes);
};

module.exports = routes;
