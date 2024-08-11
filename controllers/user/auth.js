import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { sendWelcomeMail, sendForgotPasswordMail } from "../../utils/mail/index.js";
import { logErrorToSentry } from "../../utils/sentry/index.js";

// @desc Create a new user
// @route POST /api/signup
// @access Public

const signupUser = async (req, res) => {
  const date = new Date();
  req.body.roles = {
    [date.getFullYear()]: "registered",
  };
  let user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    await user.generateDefaultAvatar();
    sendWelcomeMail(user.email, user.name);
    const role = await user.checkRole();
    user = user.toObject();
    user.role = role;
    res.status(201).json({ user, token });
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "signupUser",
    });
    res.status(400).json(err);
  }
};

// @desc Login user
// @route POST /api/login
// @access Public

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    const role = await user.checkRole();
    user = user.toObject();
    user.role = role;
    res.status(200).json({ user, token });
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "loginUser",
    });
    res.status(400).json(err);
  }
};

// @desc Auth using Google
// @route POST /api/google
// @access Public

const googleAuth = async (req, res) => {
  try {
    const checkUser = await User.find({ email: req.body.email }).select("name username defaultAvatar avatar googleAuth title");
    if (!checkUser.length) {
      const date = new Date();
      req.body.roles = {
        [date.getFullYear()]: "registered",
      };

      let user = new User(req.body);
      const token = await user.generateAuthToken();
      await user.generateDefaultAvatar();
      sendWelcomeMail(user.email, user.name);
      const role = await user.checkRole();
      user = user.toObject();
      user.role = role;
      res.status(201).json({ user, token });
    } else {
      const token = await checkUser[0].generateAuthToken();
      const role = await checkUser[0].checkRole();
      const user = checkUser[0].toObject();
      user.role = role;
      res.status(200).json({ user, token });
    }
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "googleAuth",
    });
    res.status(400).json(err);
  }
};

// @desc Change password
// @route POST /api/changePassword
// @access Private

const changePassword = async (req, res) => {
  try {
    let user = req.user;
    user.password = req.body.password;
    await user.save();

    res.status(200).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "changePassword",
    });
    res.status(400).json();
  }
};

// @desc Reset user's password
// @route GET /api/resetPassword
// @access Public

const resetPassword = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    await User.findOneAndUpdate({ email: req.body.email }, { password });
    res.status(200).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "resetPassword",
    });
    res.status(400).json(err);
  }
};

// @desc Delete user account
// @route DELETE /api/user
// @access Private

const deleteAccount = async (req, res) => {
  try {
    await req.user.remove();
    await User.deleteOne({ _id: req.user._id });
    res.status(200).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "deleteAccount",
    });
    res.status(400).json(err);
  }
};

export { signupUser, loginUser, googleAuth, changePassword, resetPassword, deleteAccount };
