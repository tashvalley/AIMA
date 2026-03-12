const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const SALT_ROUNDS = 10;

exports.hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);

exports.generateToken = (userId) =>
  jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
