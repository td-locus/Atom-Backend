import mongoose from "mongoose";

// @desc convert string to mongoose objectID
// @argument string - string to be converted to mongoose objectID
export const mongooseObjectId = (str) => mongoose.Types.ObjectId(str);
