const express = require('express');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

dotenv.config();
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

const registerRouter = require('./routes/register');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
const port = 5000;
sequelize.sync({ force: false })
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  // proxy: true,
  cookie: {
    httpOnly: true,
    secure: false,
    // secure: true,
    domain: process.env.NODE_ENV === 'production' && '.taewitter.com',
  },
  store: new RedisStore({ client: redisClient }),
};
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.status(200).send('Hello Node!');
});
app.use('/register', registerRouter);

app.listen(port, () => {
  console.log(`${port}번 서버 실행 중!`);
});
