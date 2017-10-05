const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const timestamps = require('mongoose-timestamps');

const Schema = mongoose.Schema;

var TodoSchema = new Schema({
  title: {
    type: String,
    minLength: 1,
    maxLenth: 100,
    unique: true,
    required: true
  },

  text: {
    type: String,
    minLength: 1,
    required: true,
    trim: true
  },

  completed: {
    type: Boolean,
    default: false
  }
});

TodoSchema.plugin(uniqueValidator);
TodoSchema.plugin(timestamps);

var Todo = mongoose.model('Todo', TodoSchema);

module.exports = { Todo };
