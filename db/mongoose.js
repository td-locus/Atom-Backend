import mongoose from "mongoose";
import dotenv from "dotenv";
import { logErrorToSentry } from "../utils/sentry/index.js";
import { updateUsersRoles } from "../utils/helpers/updateRoles.js";
dotenv.config();

const ENV = process.env.NODE_ENV;
const connectionURL = ENV === "development" ? process.env.DB_URL_DEV : process.env.DB_URL;
const connectMongoose = async () => {
  try {
    await mongoose.connect(connectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongo connection established on ${ENV} DB 🚀`);
    await updateUsersRoles();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "connectMongoose",
    });
    console.log(`Mongo connection error: ${err.message} 🚨`);
  }
};

connectMongoose();
