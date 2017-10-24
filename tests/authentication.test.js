const request = require('supertest');
const expect = require('expect');

const { app } = require('./../server');
const { users, populateUsers } = require('./seed/users');
const { User } = require('./../models/user');

beforeEach(populateUsers);

describe('Authentication /api/v1/auth', () => {
  describe('POST /signup', () => {
    it('should create a new user', (done) => {
      let email = 'test4@example.com';
      let password = 'testing4';
      let username = 'test 4';

      request(app)
        .post('/api/v1/auth/signup')
        .send({ email, password, username })
        .expect(201)
        .expect((res) => {
          expect(res.headers['authorization']).toBeTruthy();
          expect(res.body.code).toBe(201);
          expect(res.body.status).toBe('success');
          expect(res.body.message).toBeDefined();
          expect(res.body.user.email).toBe(email);
          expect(res.body.user.password).toBeUndefined();
          expect(res.body.user.username).toBe(username);
          expect(res.body.user.isAdmin).toBe(users[0].isAdmin);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findOne({ username }).then((user) => {
            expect(typeof user).toBe('object');
            expect(user.password).not.toBe(password);
            expect(user.tokens.length).toBe(1);
            expect(user.tokens[0].access).toBe('auth');
            expect(user.tokens[0].token).toBeDefined();
            done();
          }).catch((e) => done(e));
        });
    });

    it('should return validation errors if request invalid', (done) => {
      let email = 'test4@example.com';
      let password = '';
      let username = ' ';

      request(app)
        .post('/api/v1/auth/signup')
        .send({ email, password, username })
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done) => {
      let email = 'test1@example.com';
      let password = 'testing';
      let username = 'testing user';

      request(app)
        .post('/api/v1/auth/signup')
        .send({ email, password, username })
        .expect(400)
        .end(done);
    });

    it('should not create user if username is in use', (done) => {
      let email = 'test4@example.com';
      let password = 'testing';
      let username = 'test 1';

      request(app)
        .post('/api/v1/auth/signup')
        .send({ email, password, username })
        .expect(400)
        .end(done);
    });

    it('should return validation errors if username length is lower than 1 character', (done) => {
      let email = 'test4@example.com';
      let password = 'testing';
      let username = '';

      request(app)
        .post('/api/v1/auth/signup')
        .send({ email, password, username })
        .expect(400)
        .end(done);
    });

    it('should return validation errors if username length is lower than 1 character', (done) => {
      let email = '';
      let password = 'testing';
      let username = 'testing';

      request(app)
        .post('/api/v1/auth/signup')
        .send({ email, password, username })
        .expect(400)
        .end(done);
    });

    it('should return validation errors if email is invalid', (done) => {
      let email = 'test4example';
      let password = 'testing';
      let username = 'testing';

      request(app)
        .post('/api/v1/auth/signup')
        .send({ email, password, username })
        .expect(400)
        .end(done);
    });
  });

  describe('POST /auth/login', () => {
    it('should login an account', (done) => {
      request(app)
        .post('/api/v1/auth/login')
        .send({
          username: users[0].username,
          password: users[0].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['authorization']).toBeDefined();
          expect(res.body.code).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.user.email).toBe(users[0].email);
          expect(res.body.user.password).toBeUndefined();
          expect(res.body.user.username).toBe(users[0].username);
          expect(res.body.user.isAdmin).toBe(users[0].isAdmin);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findOne({ username: res.body.user.username }).then((user) => {
            expect(typeof user).toBe('object');
            expect(user.tokens.length).toBe(1);
            expect(user.tokens[0].access).toBe('auth');
            expect(user.tokens[0].token).toBeDefined();
            done();
          }).catch((e) => done(e));
        });
    });

    it('should return 400 if invalid request', (done) => {
      request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'myfalseuser',
          password: ''
        })
        .expect(400)
        .end(done);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return user profile', (done) => {
      request(app)
        .get('/api/v1/auth/profile')
        .set('authorization', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.user._id).toBe(users[1]._id.toHexString());
          expect(res.body.user.email).toBe(users[1].email);
          expect(res.body.user.password).toBeUndefined();
          expect(res.body.user.username).toBe(users[1].username);
          expect(res.body.user.isAdmin).toBe(users[1].isAdmin);
        })
        .end(done);
    });

    it('should return 401 if token not provided', (done) => {
      request(app)
        .get('/api/v1/auth/profile')
        .expect(401)
        .end(done);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send an email to reset your password', (done) => {
      let email = process.env.EMAIL_USER;

      request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email })
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.message).toBeDefined();
        })
        .end(() => {
          setTimeout(function () {
            done();
          }, 500);
        });
    });

    it('should return 400 if email is not provided', (done) => {
      request(app)
        .post('/api/v1/auth/forgot-password')
        .expect(400)
        .end(done);
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should reset your password', (done) => {
      request(app)
        .post('/api/v1/auth/reset-password')
        .set('x-token', users[2].tokens[0].token)
        .send({
          password: 'new test password'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.message).toBeDefined();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findOne({ username: users[2].username }).then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
          }).catch((e) => done(e));
        });
    });

    it('should return 400 if token is not provided or expired', (done) => {
      request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          password: 'new test password'
        })
        .expect(400)
        .end(done);
    });

    it('should return 400 if request invalid', (done) => {
      request(app)
      .post('/api/v1/auth/reset-password')
      .send({ password: '' })
      .expect(400)
      .end(done);
    });
  });

  describe('GET /auth/logout', () => {
    it('should logout an user', (done) => {
      request(app)
        .get('/api/v1/auth/logout')
        .set('authorization', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.message).toBeDefined();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findOne({ username: users[1].username }).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((e) => done(e));
        });
    });

    it('should return 401 if token not provided', (done) => {
      request(app)
        .get('/api/v1/auth/logout')
        .expect(401)
        .end(done);
    });
  });
});
