/**
 * Admin Router - Auth Routes
 */

// Dependencies
const Router = require('express').Router();
const authController = require('../controllers/auth');

Router.post('/login', authController.loginAdmin);

Router.post('/login/google', authController.googleLoginAdmin);

module.exports = Router;