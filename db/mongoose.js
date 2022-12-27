import mongoose from "mongoose";
import dotenv from "dotenv";
import { logErrorToSentry } from "../utils/sentry/index.js";
dotenv.config();

// const connectionURL = process.env.NODE_ENV !== "development" ? process.env.DB_URL_PROD : process.env.DB_URL_DEV;
const ENV = process.env.NODE_ENV;
let connectionURL = "";
switch (ENV) {
  case "development":
    connectionURL = process.env.DB_URL_DEV;
    break;
  case "production":
    connectionURL = process.env.DB_URL_PROD;
    break;
  case "staging":
    connectionURL = process.env.DB_URL_STAGING;
    break;
  default:
    connectionURL = process.env.DB_URL_DEV;
}
const connectMongoose = async () => {
  mongoose
    .connect(connectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Mongo connection established on ${connectionURL} 🚀`))
    .catch((err) => {
      logErrorToSentry(err, {
        workflow: "connectMongoose",
      });
      console.log(`Mongo connection error: ${err.message} 🚨`);
    });
};

connectMongoose();
