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

const port = process.env.PORT || 8000;

let app = express();

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
}

app.use('/', express.static(__dirname + '/apidoc'));

require('./routes')(app);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

module.exports = { app };
