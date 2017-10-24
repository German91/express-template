const Router = require('express').Router();

const Authentication = require('./../controllers/authentication');
const { isLogged } = require('./../middlewares/authorization');

Router.route('/signup').post(Authentication.signin);
Router.route('/login').post(Authentication.login);
Router.route('/profile').get(isLogged, Authentication.profile);
Router.route('/forgot-password').post(Authentication.forgotPassword);
Router.route('/reset-password').post(Authentication.resetPassword);
Router.route('/logout').get(isLogged, Authentication.logout);

module.exports = Router;
