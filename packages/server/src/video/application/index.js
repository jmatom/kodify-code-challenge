'use strict';

const createGetToken = require('./get-token');

/**
 * This folder is storing the use cases (also named as application services)
 * App Services / Use cases can be invoked (usually by controllers or command handlers
 * when we are working with async messages). For this reason, our use cases export a
 * method named "execute"
 */

module.exports = {
  createGetToken,
};
