import User from "../../models/User.js";
import { logErrorToSentry } from "../../utils/sentry/index.js";

// @desc Get electrons
// @route POST /api/electrons
// @access Private

const getElectrons = async (req, res) => {
  try {
    const date = new Date();
    const type = `roles.${date.getFullYear()}`;
    const users = await User.find({ [type]: "registered" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "getElectrons",
    });
    res.status(400).json();
  }
};

// @desc Get protons
// @route POST /api/protons
// @access Private

const getProtons = async (req, res) => {
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
    logErrorToSentry(err, {
      workflow: "getProtons",
    });
    res.status(400).json();
  }
};

// @desc Get all members - Team directory
// @route POST /api/members
// @access Private

const getMembers = async (req, res) => {
  try {
    const date = new Date();
    const type = `roles.${date.getFullYear()}`;
    let query = { $or: [{ [type]: "team-lead" }, { [type]: "vice-lead" }, { [type]: "lead" }, { [type]: "member" }, { [type]: "mentor" }] };

    const users = await User.find(query).select("-password").sort({ name: 1 });

    res.status(200).json(users);
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "getMembers",
    });
    res.status(400).json();
  }
};

// @desc Get nucleus
// @route POST /api/nucleus
// @access Private

const getNucleus = async (req, res) => {
  try {
    const date = new Date();
    const type = `roles.${date.getFullYear()}`;

    const users = await User.find({ [type]: "mentor" })
      .select("-password")
      .sort({ name: 1 });
    res.status(200).json(users);
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "getNucleus",
    });
    res.status(400).json();
  }
};

// @desc get assignees
// @route GET /api/assignees
// @access Private

const getAssignees = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("name username _id");
    res.status(200).json(users);
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "getAssignees",
    });
    res.status(400).json();
  }
};

// @desc Get profile of a user
// @route GET /api/users/:username
// @access Private

const getUserProfile = async (req, res) => {
  try {
    const user = await User.find({ username: req.params.username });
    res.status(200).json(user[0]);
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "getUserProfile",
    });
    res.status(400).json(err);
  }
};

export { getElectrons, getProtons, getNucleus, getAssignees, getUserProfile, getMembers };
