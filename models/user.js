const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const timestamps = require('mongoose-timestamps');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const pagination = require('mongoose-paginate');
const _ = require('lodash');

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  email: {
    type: String,
    required: 'Email is required',
    trim: true,
    minlength: [1, 'Email must be at least 1 character'],
    unique: true,
    validate: [{
      isAsync: false,
      validator: validator.isEmail,
      msg: 'Invalid email.'
    }]
  },

  username: {
    type: String,
    required: 'Username is required',
    minlength: [1, 'Username must be at least 1 character'],
    maxlength: [100, 'Username must be lower than 100 characters'],
    unique: true,
  },

  password: {
    type: String,
    minglength: [6, 'Password must be at least 6 characters'],
    required: 'Password is required'
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  tokens: [{
    access: {
      type: String,
      required: 'Access token is required',
      enum: ['auth', 'password']
    },

    token: {
      type: String,
      required: 'Token is required'
    }
  }]
});

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(timestamps);
UserSchema.plugin(pagination);

/**
 * Return user's information
 * @return {Object} {_id, email, username, isAdmin}
 */
UserSchema.methods.toJSON = function () {
  let user = this;

  return _.pick(user, ['_id', 'email', 'username', 'isAdmin']);
};

/**
 * Generate authentication token
 * @return {String}
 */
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({ _id: user._id, access }, process.env.JWT_SECRET, { expiresIn: '1d' });

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  }).catch((e) => {
    return e;
  });
};

/**
 * Generate password token
 * @return {String}
 */
UserSchema.methods.generatePasswordToken = function () {
  let user = this;
  let access = 'password';
  let token = jwt.sign({ _id: user._id, access }, process.env.JWT_SECRET, { expiresIn: '10m' });

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token
  }).catch((e) => {
    return e;
  });
};

/**
 * Remove token from user's tokens
 * @param  {String} token   User's token
 * @return {Promise}
 */
UserSchema.methods.removeToken = function (token) {
  let user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  });
};

/**
 * Find an user by token and access
 * @param  {String} token
 * @param  {String} access ['auth', 'password']
 * @return {Promise}
 */
UserSchema.statics.findByToken = function (token, access) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject(e);
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': access
  });
};

/**
 * Find an user by username and check
 * if the password matchs
 * @param  {String} username User's username
 * @param  {String} password User's password
 * @return {Promise}
 */
UserSchema.statics.findByCredentials = function (username, password) {
  let User = this;

  return User.findOne({ username }).then((user) => {
    if (!user) {
      return Promise.reject('User not found');
    }

    return new Promise(function(resolve, reject) {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject(err);
        }
      });
    });
  });
};

/**
 * Check if user is an admin
 * @param  {String} id  User's id
 * @return {Boolean}
 */
UserSchema.statics.isAdmin = function (id) {
  let User = this;

  return new Promise(function(resolve, reject) {
    User.findById(id).then((user) => {
      if (!user || !user.isAdmin) {
        reject();
      }

      resolve();
    }).catch((e) => {
      reject(e);
    });
  });
};

UserSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

let User = mongoose.model('User', UserSchema);

module.exports = { User };
