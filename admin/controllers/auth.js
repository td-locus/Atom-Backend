/**
 * Auth Controller
 */

// Dependencies
const User = require("../../models/User");
const ApiError = require("../../utils/ApiError");

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
    } catch (error) {
        return next(error);
    }
};

exports.googleLoginAdmin = async (req, res) => {
    try {

    } catch (error) {
        return next(error);
    }
};