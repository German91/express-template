const { User } = require('./../models/user');

/**
 * Check if user is logged finding by token
 * @return {Response}
 */
const isLogged = (req, res, next) => {
  let access = 'auth';
  let token = req.headers['authorization'];

  User.findByToken(token, access).then((user) => {
    if (!user) {
      Promise.reject();
    }

    req.user = user.toJSON();
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send({ code: 401, status: 'error', message: e });
  });
};

/**
 * Check if the user already logged has admin permissions
 * @return {Response}
 */
const isAdmin = (req, res, next) => {
  let access = 'auth';
  let token = req.headers['authorization'];

  User.findByToken(token, access).then((user) => {
    if (!user) {
      Promise.reject();
    }

    req.user = user.toJSON();
    req.token = token;

    return User.isAdmin(req.user._id).then((res) => {
      next();
    });
  }).catch((e) => {
    res.status(401).send({ code: 401, status: 'error', message: e });
  });
};

module.exports = { isLogged, isAdmin };
