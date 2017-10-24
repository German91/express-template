require('./../config/config');

const expect = require('expect');

const { sendMail } = require('./../services/mailer');

describe('Mailer', () => {
  it('should send an email', (done) => {
    let email = process.env.EMAIL_USER;
    let data = { text: 'Hi There' };
    let template = 'example';

    sendMail(email, data, template).then((response) => {
      done();
    }).catch((e) => done(e));
  });
});
