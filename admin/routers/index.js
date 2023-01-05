/**
 * Admin Router Hub
 */

// Dependencies
const Router = require('express').Router();
const authController = require('./auth');
const userController = require('./user');

Router.use('/api/admin/auth', authController);
Router.use('/api/admin/user', userController);

module.exports = Router;