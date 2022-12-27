import Project from "../models/Project.js";
import { mongooseObjectId } from "../utils/helpers/functions.js";

// @desc create a new project
// @route POST /api/project
// @access Private

const createProject = async (req, res) => {
  const project = new Project({
    name: "Atom Mobile User App",
    domain: "Web",
    desc: "Is there a function to turn a string into an objectId in node using mongoose? The schema specifies that something is an ObjectId, but when it is saved from a string, mongo tells me it is still just a string. The _id of the object, for instance, is displayed as objectId().",
    lead: [mongooseObjectId("61a8990768ffbf2c1d535fad")],
    members: [mongooseObjectId("61a9ea17387b0de7167930ba"), mongooseObjectId("61a9ea4e387b0de7167930df")],
    meta: {
      isOpenSource: true,
      isInternal: false,
      isPaid: false,
    },
    startDateTime: new Date(),
    endDateTime: new Date(),
    owner: req.user._id,
  });
  await project.save();
  res.status(201).json(project);
};

// @desc get project
// @route GET /api/project
// @access Private

const getProject = async (req, res) => {
  const project = await Project.find({}).populate("owner", "name username").populate("lead", "name username");
  res.status(200).json(project);
};

export default { createProject, getProject };
