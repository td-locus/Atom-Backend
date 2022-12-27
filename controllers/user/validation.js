import User from "../../models/User.js";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

// @desc Check if email is taken or not
// @route POST /api/isEmailTaken
// @access Public

const isEmailTaken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (user) res.status(400).json();
    return res.status(200).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "isEmailTaken",
    });
    return res.status(400).json(err);
  }
};

// @desc Check if username is taken or not
// @route POST /api/isUsernameTaken
// @access Public

const isUsernameTaken = async (req, res) => {
  try {
    const username = req.body.username;
    console.log(username);
    const user = await User.findOne({ username });
    if (user) res.status(400).json();
    return res.status(200).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "isUsernameTaken",
    });
    return res.status(400).json(err);
  }
};

// @desc Check if email is taken or not from profile page
// @route POST /api/isEmailAvailable
// @access Public

const isEmailAvailable = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (user?.email === req.user.email || !user) res.status(200).json();
    return res.status(400).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "isEmailAvailable",
    });
    return res.status(400).json(err);
  }
};

// @desc Check if username is taken or not from profile page
// @route POST /api/isUsernameAvailable
// @access Public

const isUsernameAvailable = async (req, res) => {
  try {
    const username = req.body.username;
    const user = await User.findOne({ username });

    if (user?.username === req.user.username || !user) res.status(200).json();
    return res.status(400).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "isUsernameAvailable",
    });
    return res.status(400).json(err);
  }
};

// @desc Check email for forgot password & send otp
// @route POST /api/checkEmail
// @access Public

const checkEmail = async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });

    // no match found
    if (!user.length) {
      res.status(403).json();
      return;
    }
    // send otp
    if (user[0].password) {
      const OTP = sendForgotPasswordMail(req.body.email, user[0].name);
      res.status(200).json({
        OTP: cryptr.encrypt(OTP),
      });
      return;
    }
    // google auth user
    res.status(400).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "checkEmail",
    });
    res.status(400).json(err);
  }
};

// @desc Check if password is same
// @route POST /api/isPasswordMatching
// @access Private

const isPasswordMatching = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user || !user.password) res.status(401).json();

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) res.status(200).json();
    res.status(400).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "isPasswordMatching",
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

export { isEmailTaken, isUsernameTaken, isEmailAvailable, isUsernameAvailable, checkEmail, isPasswordMatching, changePassword };
