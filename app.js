const express = require('express');
const morgan = require('morgan');

const CustomError = require('./utils/errorMiddleware');
const globalErrorHandler = require('./controllers/errorController');
const { getConfValue } = require('./utils/confService');
const userRouter = require('./routes/usersRouter');
const songRouter = require('./routes/songsRouter');

const app = express();

console.log(getConfValue('NODE_ENV'));
if (getConfValue('NODE_ENV') === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

/*
 * Cutsom middleware
 */
app.use((req, res, next) => {
  console.info(`Todays date is ${new Date(Date.now()).toLocaleDateString()}`);
  next();
});

app.get('/', (_, res) => res.status(200).send('I am aive !'));

app.use('/api/v1/songs', songRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const err = new CustomError(
    400,
    `The url ${req.originalUrl} is not present in the server.`
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
