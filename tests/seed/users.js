const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const { User } = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const userThreeId = new ObjectId();
const users = [
  {
    _id: userOneId,
    email: 'test1@example.com',
    username: 'test 1',
    password: 'testing1',
    isAdmin: false
  },
  {
    _id: userTwoId,
    email: 'test2@example.com',
    username: 'test 2',
    password: 'testing2',
    isAdmin: false,
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET, { expiresIn: '1d' })
    }]
  },
  {
    _id: userThreeId,
    email: 'test3@example.com',
    username: 'test 3',
    password: 'testing3',
    isAdmin: true,
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userThreeId, access: 'auth' }, process.env.JWT_SECRET, { expiresIn: '1d' })
      },
      {
        access: 'password',
        token: jwt.sign({ _id: userThreeId, access: 'password' }, process.env.JWT_SECRET, { expiresIn: '10m' })
      }
    ]
  }
];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();
    let userThree = new User(users[2]).save();

    return Promise.all([userOne, userTwo, userThree]);
  }).then(() => done());
};

module.exports = { users, populateUsers };
