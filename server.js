require('dotenv').config();
require('./config/config');
require('./database/db');

const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

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
app.use(logger('combined'));

app.set('socket', io);

io.on('connection', () => console.log('User connected'));

require('./routes')(app);

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
      console.error(err);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});

module.exports = { app };
