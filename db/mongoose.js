import mongoose from "mongoose";
import dotenv from "dotenv";
import { logErrorToSentry } from "../utils/sentry/index.js";
dotenv.config();

const ENV = process.env.NODE_ENV;
const connectionURL = ENV === "development" ? process.env.DB_URL_DEV : process.env.DB_URL;
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
