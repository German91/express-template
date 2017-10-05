const { ObjectId } = require('mongodb');

var { Todo } = require('../models/todo');

exports.create = (req, res, next) => {

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

  Todo.findOneById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send({ code: 404, status: 'error', message: 'Todo not found' });
    }

    res.status(200).send({ code: 200, status: 'success', todo });
  }).catch((err) => {
    res.status(400).send({ code: 400, status: 'error', message: err });
  });
};

exports.update = (req, res, next) => {

};

exports.remove = (req, res, next) => {

};
