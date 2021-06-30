const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');
const env = process.env;

// Sets by express Js
// console.log(app.get('env'));

// console.log(env);
const connectionString = env.DATABASE_LOCAL.replace(
  '%LOCAL_DB_PORT%',
  env.LOCAL_DB_PORT
);
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successfully Established!'))
  .catch(() => console.log('Error while connecting to database..'));

const port = env.PORT || Number(3000);
app.listen(port, () => console.log(`App listening on ${port} port...`));
