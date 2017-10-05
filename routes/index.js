var Todos = require('./todos');

const routes = (app) => {
  app.use('/api/v1/todos', Todos);
};

module.exports = routes;
