const _ = require('lodash');

const { User } = require('./../models/user');
const { sendMail } = require('./../services/mailer');

/**
 * @api {post} /v1/auth/signup Create a new user
 * @apiName Signup
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 *
 * @apiParam {String} email                 User's email
 * @apiParam {String} password              User's password
 * @apiParam {String} username              User's username
 * @apiParam {Boolean} isAdmin              (Optional)
 *
 * @apiHeader {String} Authorization        Authorization token.
 *
 * @apiSuccess (Success 2xx) 201/Createds
 * @apiSuccessExample Success-Response:
 *   HTTP 201 CREATED
 *   {
 *     code: 201,
 *     status: 'success',
 *     message: 'Account successfully created',
 *     user: Object(_id, email, password, username, isAdmin)
 *   }
 * @apiError 400/Bad-Request               Invalid params
 */
exports.signin = (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'username', 'isAdmin']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('Authorization', token).status(201).send({
      code: 201,
      status: 'success',
      message: 'Account successfully created',
      user: user.toJSON()
    });
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};

/**
 * @api {post} /v1/auth/login Login
 * @apiName Login
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 *
 * @apiParam {String} username              User's username
 * @apiParam {String} password              User's password
 *
 * @apiHeader {String} Authorization        Authorization token.
 *
 * @apiSuccess (Success 2xx) 200/OK
 * @apiSuccessExample Success-Response:
 *   HTTP 200 OK
 *   {
 *     code: 200,
 *     status: 'success',
 *     user: Object(_id, email, password, username, isAdmin)
 *   }
 * @apiError 400/Bad-Request               Invalid params
 * @apiError 404/Not-Found                 User not found
 */
exports.login = (req, res) => {
  let body = _.pick(req.body, ['username', 'password']);

  User.findByCredentials(body.username, body.password).then((user) => {
    if (!user) {
      return res.status(404).send({ code: 404, status: 'error', message: 'User not found' });
    }

    return user.generateAuthToken().then((token) => {
      res.header('Authorization', token).status(200).send({
        code: 200,
        status: 'success',
        user: user.toJSON()
      });
    });
  }).catch((e) => {
    console.error(e);
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};

/**
 * @api {get} /v1/auth/profile User's profile
 * @apiName Profile
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 *
 * @apiHeader {String} Authorization        Authorization token.
 *
 * @apiSuccess (Success 2xx) 200/OK         Success
 * @apiSuccessExample Success-Response:
 *   HTTP 200 OK
 *   {
 *     code: 200,
 *     status: 'success',
 *     user: Object(_id, email, password, username, isAdmin)
 *   }
 * @apiError 401/Unauthorized
 */
exports.profile = (req, res) => {
  res.status(200).send({ code: 200, status: 'success', user: req.user });
};

/**
 * @api {post} /v1/auth/forgot-password      Forgot Password
 * @apiName ForgotPassword
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 *
 * @apiParam {String} email                 User's email
 *
 * @apiSuccess (Success 2xx) 200/OK         Success
 * @apiSuccessExample Success-Response:
 *   HTTP 200 OK
 *   {
 *     code: 200,
 *     status: 'success',
 *     message: 'Check your email in order to reset your password'
 *   }
 * @apiError 400/Bad-Request
 */
exports.forgotPassword = (req, res) => {
  let email = req.body.email;

  User.findOne({ email }).then((user) => {
    return user.generatePasswordToken().then((token) => {
      let url = `${process.env.PASSWORD_URL}/reset-password/${token}`;

      return sendMail(email, { url }, 'forgotPassword').then(() => {
        res.header('x-token', token).status(200).send({
          code: 200,
          status: 'success',
          message: 'Check your email in order to reset your password'
        });
      });
    });
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};

/**
 * @api {post} /v1/auth/reset-password      Reset Password
 * @apiName ResetPassword
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 *
 * @apiHeader {String} x-token              Reset password token.
 *
 * @apiParam {String} password              New user's password
 *
 * @apiSuccess (Success 2xx) 200/OK         Success
 * @apiSuccessExample Success-Response:
 *   HTTP 200 OK
 *   {
 *     code: 200,
 *     status: 'success',
 *     message: 'Password successfully updated'
 *   }
 * @apiError 400/Bad-Request
 */
exports.resetPassword = (req, res) => {
  let access = 'password';
  let token = req.headers['x-token'];
  let password = req.body.password;

  User.findByToken(token, access).then((user) => {
    return user.removeToken(token).then(() => {
      user.password = password;

      return user.save().then(() => {
        res.status(200).send({ code: 200, status: 'success', message: 'Password successfully updated' });
      });
    });
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};

/**
 * @api {patch} /v1/auth/profile           Update profile
 * @apiName UpdateProfile
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 *
 * @apiHeader {String} Authorization        Authorization token.
 *
 * @apiSuccess (Success 2xx) 200/OK
 * @apiSuccessExample Success-Response:
 *   HTTP 200 OK
 *   {
 *     code: 200,
 *     status: 'success',
 *     message: 'Profile successfully updated'
 *     user: Object(_id, email, username, isAdmin)
 *   }
 * @apiError 400/Bad-Request                Invalid params
 * @apiError 404/Not-Found                  User not found
 */
exports.updateProfile = (req, res) => {
  let body = _.pick(req.body, ['email', 'username']);

  User.findByIdAndUpdate(req.user._id, {
    $set: body
  }, { new: true, runValidators: true, context: 'query' }).then((user) => {
    if (!user) {
      return res.status(404).send({ code: 404, status: 'error', message: 'User not found' });
    }

    res.status(200).send({ code: 200, status: 'success', message: 'Profile successfully updated', user: user.toJSON() });
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};

/**
 * @api {get} /v1/auth/logout               Logout
 * @apiName logout
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 *
 * @apiHeader {String} authorization      Authorization token.
 *
 * @apiSuccess (Success 2xx) 200/OK         Success
 * @apiSuccessExample Success-Response:
 *   HTTP 200 OK
 *   {
 *     code: 200,
 *     status: 'success',
 *     message: 'Successfully logged out'
 *   }
 * @apiError 400/Bad-Request
 */
exports.logout = (req, res) => {
  User.findById(req.user._id).then((user) => {
    return user.removeToken(req.token).then(() => {
      req.user = undefined;
      req.token = undefined;

      res.status(200).send({ code: 200, status: 'success', message: 'Successfully logged out' });
    });
  }).catch((e) => {
    res.status(400).send({ code: 400, status: 'error', message: e });
  });
};
