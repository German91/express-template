const request = require('supertest');
const expect = require('expect');
const { ObjectId } = require('mongodb');

var { app } = require('../server');
var { Todo } = require('../models/todo');

const todos = [
  {
    _id: new ObjectId(),
    title: 'Todo 1',
    text: 'This is a todo test'
  },
  {
    _id: new ObjectId(),
    title: 'Todo 2',
    text: 'This is a todo test',
    completed: true
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/api/v1/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get the first todo by id', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .get(`/api/v1/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.title).toBe(todos[0].title);
        expect(res.body.todo.text).toBe(todos[0].text);
        expect(res.body.todo.completed).toBe(todos[0].completed);
      })
      .end(done);
  });

  it('should return 400 if id is not valid', (done) => {

  });

  it('should return 404 if todo not found', (done) => {

  });
});
