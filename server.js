// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');
//Start the server
  
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//handling rejection errors
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION: Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
