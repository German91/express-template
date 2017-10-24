const nodemailer = require('nodemailer');
const path = require('path');
const Email = require('email-templates');

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

/**
 * Render a template and send an email
 * @param  {String}   to            Email
 * @param  {Object}   data          Extra information
 * @param  {String}   template      Templane to render
 * @return {Promise}
 */
const sendMail = (to, data, template) => {
  let email = new Email({
    message: { from: process.env.EMAIL_USER },
    transport: transporter,
    views: {
      options: {
        extension: 'handlebars'
      }
    }
  });

  return new Promise(function(resolve, reject) {
    return email.send({ template, message: { to }, locals: data })
    .then(() => resolve())
    .catch((e) => reject(new Error('Unable to send email', 500)));
  });
};

module.exports = { sendMail };
