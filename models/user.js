const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new BadRequest({message: 'Некорректный email'});
      }
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findOne(email, password) {
  return this.findOne({email}).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Forbidden('Неверно введены электронная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)

        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Forbidden('Неверно введены электронная почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);