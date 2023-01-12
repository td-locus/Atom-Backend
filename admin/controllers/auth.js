/**
 * Auth Controller
 */

// Dependencies
const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const ApiError = require("../../utils/ApiError");

/**
 * @description Login Admin using email and password
 * @route POST /api/admin/auth/login
 * @access Public
 * @body { email: string, password: string }
 */
exports.loginAdmin = async (req, res, next) => {
    try {
        const { email = '', password = '' } = req.body;
        let admin = await User.findOne({ email });
        console.log(admin)
        if (!admin) throw new ApiError({ status: 404, message: 'admin/invalid-email' });
        if (!admin.isAdmin()) throw new ApiError({ status: 401, message: 'admin/unauthorized-access' });
        if (!admin?.password) throw new ApiError({ status: 403, message: 'admin/google-login-required' })
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) throw new ApiError({ status: 401, message: 'admin/invalid-password' });
        const token = await admin.generateAuthToken();
        const role = await admin.checkRole();
        admin = admin.toObject();
        admin.role = role;
        res.status(200).json({ admin, token, message: 'admin/email-password-login-successful' });
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