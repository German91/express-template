require('./config/config');
require('./database/db');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const port = process.env.PORT || 8000;

let app = express();

let limiter = new rateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

app.disable('x-powered-by');
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb' ,'extended': true }));
app.use(cookieParser());
app.use(methodOverride());
app.use(compression());
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
  app.use(limiter);
}

require('./routes')(app);

if (process.env.NODE_ENV !== 'production') {
  app.use('/', express.static(__dirname + '/apidoc'));
} else {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

module.exports = { app };
