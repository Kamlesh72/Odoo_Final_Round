import mongoose from 'mongoose';

export default () => {
  mongoose.connect(process.env.MONGO_URL);

  const connection = mongoose.connection; // inherits Nodejs EventEmitter

  connection.on('connected', () => {
    console.log('MONGODB Connected Successfully');
  });

  connection.on('error', () => {
    console.log('MONGODB Connection Failed');
  });
};
