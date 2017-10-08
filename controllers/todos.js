const { ObjectId } = require('mongodb');
const _ = require('lodash');

var { Todo } = require('../models/todo');

exports.create = (req, res, next) => {
  var todo = new Todo({
    title: req.body.title,
    text: req.body.text,
    completed: req.body.completed
  });

  todo.save().then((doc) => {
    res.status(201).send({ code: 201, status: 'success', todo: doc });
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'success', message: e });
  });
};

exports.getAll = (req, res, next) => {
  Todo.find().then((todos) => {
    res.status(200).send({todos});
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};

exports.getOne = (req, res, next) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ code: 400, status: 'error', message: 'Id not valid' });
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send({ code: 404, status: 'error', message: 'Todo not found' });
    }

    res.status(200).send({ code: 200, status: 'success', todo });
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};

exports.update = (req, res, next) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['title', 'text', 'completed']);

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ code: 400, status: 'error', message: 'Id not valid' });
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
    if (!todo) {
      return res.status(404).send({ code: 404, status: 'error', message: 'Todo not found' });
    }

    res.status(200).send({ code: 200, status: 'success', message: 'Todo successfully updated', todo });
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};

exports.remove = (req, res, next) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ code: 400, status: 'error', message: 'Id not valid' });
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send({ code: 404, status: 'error', message: 'Todo not found' });
    }

    res.status(200).send({ code: 200, status: 'success', message: 'Todo successfully removed', todo });
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};
