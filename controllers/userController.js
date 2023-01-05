const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendWelcomeMail, sendForgotPasswordMail } = require("../mail/mail");
const Cryptr = require("cryptr");
const { LEGAL_TLS_SOCKET_OPTIONS } = require("mongodb");
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

// @desc Create a new user
// @route POST /api/signup
// @access Public
exports.signupUser = async (req, res) => {
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
    res.status(400).json({ err });
  }
};

// @desc Check if email is taken or not
// @route POST /api/isEmailTaken
// @access Public

exports.isEmailTaken = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (user) res.status(400).json();
  return res.status(200).json();
};

// @desc Check if username is taken or not
// @route POST /api/isUsernameTaken
// @access Public

exports.isUsernameTaken = async (req, res) => {
  const username = req.body.username;
  const user = await User.findOne({ username });
  if (user) res.status(400).json();
  return res.status(200).json();
};

// @desc Check if email is taken or not from profile page
// @route POST /api/isEmailAvailable
// @access Public

exports.isEmailAvailable = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });

  if (user?.email === req.user.email || !user) res.status(200).json();
  return res.status(400).json();
};

// @desc Check if username is taken or not from profile page
// @route POST /api/isUsernameAvailable
// @access Public

exports.isUsernameAvailable = async (req, res) => {
  const username = req.body.username;
  const user = await User.findOne({ username });

  if (user?.username === req.user.username || !user) res.status(200).json();
  return res.status(400).json();
};

// @desc Login user
// @route POST /api/login
// @access Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    const role = await user.checkRole();
    user = user.toObject();
    user.role = role;
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc Auth using Google
// @route POST /api/google
// @access Public
exports.googleAuth = async (req, res) => {
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
    res.status(400).json();
  }
};

// @desc Check email for forgot password & send otp
// @route POST /api/checkEmail
// @access Public
exports.checkEmail = async (req, res) => {
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
    res.status(400).json(err);
  }
};

// @desc Reset user's password
// @route GET /api/resetPassword
// @access Public
exports.resetPassword = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    await User.findOneAndUpdate({ email: req.body.email }, { password });
    res.status(200).json();
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc Get general profile details
// @route GET /api/general
// @access Private
exports.getGeneralProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let general = user.toObject();
    delete general.password;
    res.status(200).json(general);
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc Get interests
// @route GET /api/getInterests
// @access Private
exports.getInterests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let general = user.toObject(),
      interests = [],
      website = "";
    if (general.interests.length) interests = general.interests;
    if (general.website) website = general.website;
    res.status(200).json({ interests, website });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc Update general profile details
// @route POST /api/general
// @access Private
exports.updateGeneralProfile = async (req, res) => {
  try {
    let updates = Object.keys(req.body);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    let interests = [],
      stacks = [];
    if (req.body.interests.length) {
      interests = req.body.interests.split(",").map((interest) => {
        return interest.length > 0 && interest.trim();
      });
    }
    req.user.interests = interests;
    if (req.body.stacks.length) {
      stacks = req.body.stacks.split(",").map((stack) => {
        return stack.length > 0 && stack.trim();
      });
    }
    req.user.stacks = stacks;

    await req.user.save();
    res.status(200).json(req.user);
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc Update avatar
// @route POST /api/avatar
// @access Private
exports.updateAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar });
    res.status(200).json();
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Delete avatar
// @route DELETE /api/avatar
// @access Private
exports.deleteAvatar = async (req, res) => {
  try {
    req.user.avatar = "";
    await req.user.save();
    res.status(200).json({ user: req.user });
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Get social links
// @route GET /api/social
// @access Private
exports.getSocialLinks = async (req, res) => {
  res.json({ links: req.user.links });
};

// @desc Update social links
// @route POST /api/social
// @access Private
exports.updateSocialLinks = async (req, res) => {
  try {
    req.user.links = req.body;
    await req.user.save();
    res.status(200).json({ user: req.user });
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Update social links
// @route POST /api/social
// @access Private
exports.updateSocialLinks = async (req, res) => {
  try {
    let user = req.user;
    user.links = req.body;
    await user.save();
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Check if password is same
// @route POST /api/isPasswordMatching
// @access Private

exports.isPasswordMatching = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user || !user.password) res.status(401).json();

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (isMatch) res.status(200).json();
  res.status(400).json();
};

// @desc Change password
// @route POST /api/changePassword
// @access Private

exports.changePassword = async (req, res) => {
  try {
    let user = req.user;
    user.password = req.body.password;
    await user.save();

    res.status(200).json();
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Delete user account
// @route DELETE /api/user
// @access Private

exports.deleteAccount = async (req, res) => {
  try {
    await req.user.remove();
    await User.deleteOne({ _id: req.user._id });
    res.status(200).json();
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Add personal details
// @route POST /api/personal
// @access Private

exports.addPersonalDetails = async (req, res) => {
  try {
    let skillSet = {
      soft: [],
      hard: [],
    };

    if (req.body.skillSet.soft) {
      skillSet.soft = req.body.skillSet.soft.split(",").map((skill) => {
        return skill.length > 0 && skill.trim();
      });
    }
    if (req.body.skillSet.hard) {
      skillSet.hard = req.body.skillSet.hard.split(",").map((skill) => {
        return skill.length > 0 && skill.trim();
      });
    }
    req.user.college = req.body.college;
    req.user.domain = req.body.domain;
    req.user.skillSet = skillSet;
    req.user.dob = req.body.dob;
    req.user.phone = req.body.phone;
    if (req.user.domain.memberSince) {
      const roles = {};
      const startYear = req.user.domain.memberSince.getFullYear();
      const year = new Date().getFullYear();
      for (let i = startYear; i <= year; i++) {
        roles[i] = "member";
      }
      req.user.roles = roles;
    }
    await req.user.save();
    res.status(200).json();
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Get personal details
// @route POST /api/personal
// @access Private

exports.getPersonalDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const data = {
      college: user.college,
      domain: user.domain,
      skillSet: user.skillSet,
      dob: user.dob,
      phone: user.phone,
    };
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Get electrons
// @route POST /api/electrons
// @access Private

exports.getElectrons = async (req, res) => {
  try {
    const date = new Date();
    const type = `roles.${date.getFullYear()}`;
    const users = await User.find({ [type]: "registered" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Get protons
// @route POST /api/protons
// @access Private

exports.getProtons = async (req, res) => {
  try {
    const date = new Date();
    const type = `roles.${date.getFullYear()}`;
    let query = { $or: [{ [type]: "team-lead" }, { [type]: "lead" }, { [type]: "vice-lead" }, { [type]: "member" }] };
    if (req.query.domain && req.query.domain !== "all") {
      query = {
        ...query,
        "domain.domainPrimary": req.query.domain,
      };
    }
    if (req.query.role && req.query.role !== "all" && req.query.role !== "lead") {
      query = {
        ...query,
        [type]: req.query.role,
      };
    }
    if (req.query.role === "lead") {
      query = {
        ...query,
        $or: [{ [type]: "team-lead" }, { [type]: "lead" }],
      };
    }
    const users = await User.find(query).select("-password").sort({ name: 1 });

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Get all members - Team directory
// @route POST /api/members
// @access Private

exports.getMembers = async (req, res) => {
  try {
    const date = new Date();
    const type = `roles.${date.getFullYear()}`;
    let query = { $or: [{ [type]: "team-lead" }, { [type]: "vice-lead" }, { [type]: "lead" }, { [type]: "member" }, { [type]: "mentor" }] };

    const users = await User.find(query).select("-password").sort({ name: 1 });

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Get nucleus
// @route POST /api/nucleus
// @access Private

exports.getNucleus = async (req, res) => {
  try {
    const date = new Date();
    const type = `roles.${date.getFullYear()}`;

    const users = await User.find({ [type]: "mentor" })
      .select("-password")
      .sort({ name: 1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Calculate profile completion
// @route POST /api/profileCompleted
// @access Private

exports.getProfileCompleted = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-_id -__v -createdAt -updatedAt");
    user = user.toObject();
    let c = 0;
    Object.keys(user).forEach((info) => {
      if (typeof user[info] === "string") {
        if (user[info].length) c++;
      } else if (typeof user[info] === "object") {
        if (Object.keys(user[info]).length) c++;
      }
    });
    const percentage = (c / 18) * 100;
    res.status(200).json(percentage);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc fetch role of user
// @route GET /api/role
// @access Private

exports.getRole = async (req, res) => {
  try {
    const role = await req.user.checkRole();
    res.status(200).json(role);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc get assignees
// @route GET /api/assignees
// @access Private

exports.getAssignees = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("name username _id");
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc Get profile of a user
// @route GET /api/users/:username
// @access Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.find({ username: req.params.username });
    res.status(200).json(user[0]);
  } catch (err) {
    res.status(400).json(err);
  }
};
