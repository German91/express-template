const nodemailer = require('nodemailer');
const path = require('path');
const emailTemplate = require('email-templates');

var transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

/**
 * Rende a template and send an email
 * @param  {Object}   user          User's email and data to send
 * @param  {String}   subject       Email subject
 * @param  {String}   templateName  Templane to render
 * @param  {Function} callback      Callback
 * @return {String}   Response's message
 */
exports.sendMail = (user, subject, templateName, callback) => {
  var templatesDir = path.resolve(__dirname, '..', 'templates');
  var template = new emailTemplate(path.join(templatesDir, templateName));

  template.render(user, (err, results) => {
    if (err) return callback(err);

    transporter.sendMail({ from: process.env.EMAIL_USER, to: user.email, subject, html: results.html }, (err, response) => {
      if (err) return callback(err);

      callback(null, response.message);
    });
  });
};
