const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 8;
const Event = require("./Event");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
    },
    title: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    collegeEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
    defaultAvatar: {
      type: String,
    },
    avatar: {
      type: String,
    },
    dob: { type: Date },
    phone: { type: String },
    domain: {
      domainPrimary: {
        type: String,
      },
      domainSecondary: {
        type: String,
      },
      memberSince: {
        type: Date,
      },
    },
    roles: {
      type: Object,
    },
    college: {
      name: {
        type: String,
      },
      location: {
        type: String,
      },
      graduationYear: {
        type: Date,
      },
    },
    links: {
      instagram: {
        type: String,
      },
      github: {
        type: String,
      },
      linkedIn: {
        type: String,
      },
    },
    skillSet: {
      hard: [String],
      soft: [String],
    },
    interests: [String],
    stacks: [String],
    website: {
      type: String,
    },
    resume: {
      type: String,
    },
    status: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  return token;
};

const colors = ["red", "green", "blue", "blueGrey", "deepOrange", "deepPurple", "indigo", "lightBlue", "lightGreen", "lime", "teal", "yellow", "purple", "pink", "grey", "orange", "brown", "amber"];

userSchema.methods.generateDefaultAvatar = async function () {
  const user = this;
  const avatar = colors[Math.floor(Math.random() * (colors.length - 1)) + 1];
  user.defaultAvatar = `https://avatars.dicebear.com/api/identicon/.svg?colors[]=${avatar}`;
  await user.save();
};
userSchema.methods.checkRole = async function () {
  const user_ = this;
  const user = await User.findById(user_._id);
  const role = user.roles[Object.keys(user.roles)[Object.keys(user.roles).length - 1]];
  return role;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) throw new Error("User doesn't exist");
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) throw new Error("Unable to login, please check your email and password");
  return user;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  userObject.googleAuth = false;
  if (!userObject.password) userObject.googleAuth = true;
  delete userObject.password;
  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Event.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
