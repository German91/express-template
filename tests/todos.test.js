process.env.NOVE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost/ExpressTemplateTest';

const request = require('supertest');
const expect = require('expect');
const { ObjectId } = require('mongodb');

var { app } = require('../server');
var { Todo } = require('../models/todo');

const todos = [
  {
    _id: new ObjectId(),
    title: 'Todo 1',
    text: 'This is a todo test',
    completed: false
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
    request(app)
      .get('/api/v1/todos/123abc')
      .expect(400)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
      .get(`/api/v1/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var todo = { title: 'My new todo', text: 'Creating new todo' };

    request(app)
      .post('/api/v1/todos')
      .expect(201)
      .send(todo)
      .expect((res) => {
        expect(res.body.todo.title).toBe(todo.title);
        expect(res.body.todo.text).toBe(todo.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.created_at).toExist;
        expect(res.body.updated_at).toExist;
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ title: todo.title }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].title).toBe(todo.title);
          expect(todos[0].text).toBe(todo.text);
          expect(todos[0].completed).toBe(false);
          expect(res.body.created_at).toExist;
          expect(res.body.updated_at).toExist;
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo by id', (done) => {
    var hexId = todos[0]._id.toHexString();
    var todo = { title: 'Title updated', completed: true };
    
    request(app)
      .patch(`/api/v1/todos/${hexId}`)
      .send(todo)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.title).toBe(todo.title);
        expect(res.body.todo.completed).toBe(todo.completed);
        expect(res.body.todo.text).toExist;
        expect(res.body.todo.created_at).toExist;
        expect(res.body.todo.updated_at).toExist;
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((doc) => {
          expect(doc.title).toBe(todo.title);
          expect(doc.completed).toBe(todo.completed);
          expect(doc.text).toExist;
          expect(doc.created_at).toExist;
          expect(doc.updated_at).toExist;
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 400 if id is not valid', (done) => {
    request(app)
      .patch('/api/v1/todos/123abc')
      .expect(400)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
      .patch(`/api/v1/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should be have the same values', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .patch(`/api/v1/todos/${hexId}`)
      .send({})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.title).toBe(todos[0].title);
        expect(res.body.todo.text).toBe(todos[0].text);
        expect(res.body.todo.completed).toBe(todos[0].completed);
        expect(res.body.todo.created_at).toExist;
        expect(res.body.updated_at).toExist;
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((doc) => {
          expect(doc.title).toBe(todos[0].title);
          expect(doc.text).toBe(todos[0].text);
          expect(doc.completed).toBe(todos[0].completed);
          expect(res.body.todo.created_at).toExist;
          expect(res.body.updated_at).toExist;
          done();
        }).catch((e) => done(e));
      });
  });
});