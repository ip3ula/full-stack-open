const { request } = require('express');
const config = require('./config');
const jwt = require('jsonwebtoken');
const logger = require('./logger.js');
const morgan = require('morgan');
const User = require('../models/user');
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms');

// Error handler
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  } else if ( error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
  next(error);
};
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null;
  }

  next();
};
const userExtractor = async (request, response, next) => {
  try {
    const authorization = request.get('Authorization');
    
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '');
      const decodedToken = jwt.verify(token, config.SECRET);

      if (!decodedToken.id) {
        return response.status(401).json({ error: 'Invalid token' });
      }

      const user = await User.findById(decodedToken.id);
      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      request.user = user;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { morganMiddleware, errorHandler, tokenExtractor, userExtractor };