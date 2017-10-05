const Router = require('express').Router();

var Todos = require('../controllers/todos');

Router.route('/').get(Todos.getAll);
Router.route('/').post(Todos.create);
Router.route('/:id').get(Todos.getOne);
Router.route('/:id').patch(Todos.update);
Router.route('/:id').delete(Todos.remove);

module.exports = Router;
