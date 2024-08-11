import User from "../../models/User.js";
import { logErrorToSentry } from "../../utils/sentry/index.js";

// @desc Get interests
// @route GET /api/getInterests
// @access Private

const getInterests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let general = user.toObject(),
      interests = [],
      website = "";
    if (general.interests.length) interests = general.interests;
    if (general.website) website = general.website;
    res.status(200).json({ interests, website });
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "getInterests",
    });
    res.status(400).json(err);
  }
};

// @desc Get general profile details
// @route GET /api/general
// @access Private

const getGeneralProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let general = user.toObject();
    delete general.password;
    res.status(200).json(general);
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "getGeneralProfile",
    });
    res.status(400).json(err);
  }
};

// @desc Update general profile details
// @route POST /api/general
// @access Private

const updateGeneralProfile = async (req, res) => {
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
    logErrorToSentry(err, {
      workflow: "updateGeneralProfile",
    });
    res.status(400).json(err);
  }
};

// @desc Update avatar
// @route POST /api/avatar
// @access Private

const updateAvatar = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar });
    res.status(200).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "updateAvatar",
    });
    res.status(400).json();
  }
};

// @desc Delete avatar
// @route DELETE /api/avatar
// @access Private

const deleteAvatar = async (req, res) => {
  try {
    req.user.avatar = "";
    await req.user.save();
    res.status(200).json({ user: req.user });
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "deleteAvatar",
    });
    res.status(400).json();
  }
};

// @desc Get social links
// @route GET /api/social
// @access Private

const getSocialLinks = async (req, res) => {
  res.json({ links: req.user.links });
};

// @desc Update social links
// @route POST /api/social
// @access Private

const updateSocialLinks = async (req, res) => {
  try {
    let user = req.user;
    user.links = req.body;
    await user.save();
    res.status(200).json({ user });
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "updateSocialLinks",
    });
    res.status(400).json();
  }
};

// @desc Add personal details
// @route POST /api/personal
// @access Private

const addPersonalDetails = async (req, res) => {
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
    logErrorToSentry(err, {
      workflow: "addPersonalDetails",
    });
    res.status(400).json();
  }
};

// @desc Get personal details
// @route POST /api/personal
// @access Private

const getPersonalDetails = async (req, res) => {
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
    logErrorToSentry(err, {
      workflow: "getPersonalDetails",
    });
    res.status(400).json();
  }
};

// @desc Calculate profile completion
// @route POST /api/profileCompleted
// @access Private

const getProfileCompleted = async (req, res) => {
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
    logErrorToSentry(err, {
      workflow: "getProfileCompleted",
    });
    res.status(400).json();
  }
};

// @desc fetch role of user
// @route GET /api/role
// @access Private

const getRole = async (req, res) => {
  try {
    const role = await req.user.checkRole();
    res.status(200).json(role);
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "getRole",
    });
    res.status(400).json();
  }
};

export { getInterests, getGeneralProfile, updateGeneralProfile, updateAvatar, deleteAvatar, getSocialLinks, updateSocialLinks, addPersonalDetails, getPersonalDetails, getProfileCompleted, getRole };
