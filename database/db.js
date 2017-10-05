const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

var db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB server');
});

db.on('close', (err) => {
  console.log('Unable to connect to MongoDB server', err);
});
