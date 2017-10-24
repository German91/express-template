const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB server');
});

db.on('close', (err) => {
  console.log('Unable to connect to MongoDB server', err);
});
