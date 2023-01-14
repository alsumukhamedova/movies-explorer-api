require('dotenv').config();
const express = require('express');
const bp = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('express').Router();
const {errors} = require('celebrate');
const errorsHandler = require('./middleware/errorsHandler');
const {requestLogger, errorLogger} = require('./middleware/logger');
const users = require('./routes/users');
const movies = require('./routes/movies');
const {signUp, signIn} = require('./controllers/users');
const {signInValidator, signUpValidator} = require('./middleware/validate');
const auth = require('./middleware/auth');
const NotFound = require('./errors/notFound');
const app = express();

app.use(bp.json())
app.use(bp.urlencoded({extended: true}))

router.post('/signin', signInValidator, signIn);
router.post('/signup', signUpValidator, signUp);

router.use(auth);
router.use('/users', users);
router.use('/movies', movies);
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(router);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DB_CONNECT : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(errorLogger);

app.use(errors());
app.use(errorsHandler);

app.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 3000, () => {
  console.log(`App listening on port ${process.env.NODE_ENV === 'production' ? process.env.PORT : 3000}`);
});