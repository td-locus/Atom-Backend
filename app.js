import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

// database
import "./db/mongoose.js";

// Sentry
import Sentry from "@sentry/node";
global.sentry = Sentry;
import * as sentry from "./utils/sentry/index.js";

sentry.Init();

// Routes
import userRouter from "./routers/user.js";
import eventRouter from "./routers/event.js";
import auditRouter from "./routers/audit.js";
import domainRouter from "./routers/domain.js";
import projectRouter from "./routers/project.js";
import goodiesRouter from "./routers/goodies.js";
import taskRouter from "./routers/task.js";

/*************
 * Request tracking middleware
 * ****************/
app.use((request, response, next) => {
  console.log(request.method, request.url);
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://atom.think-digital.in",
      "https://atomstg.think-digital.in",
      "https://atom-staging.think-digital.in",
      "https://atom-staging.netlify.app",
      "https://atomthinkdigital.netlify.app",
      "https://td-teamdirectory.netlify.app",
      "https://atomstg.netlify.app",
      "https://tdatom.netlify.app",
    ],
  })
);

app.use(userRouter);
app.use(eventRouter);
app.use(auditRouter);
app.use(domainRouter);
app.use(projectRouter);
app.use(goodiesRouter);
app.use(taskRouter);

/******
 *
 * Error handling for sentry
 * *********/
if (process.env.NODE_ENV.trim() !== "development") {
  // The error handler must be before any other error middleware
  app.use(global.sentry.Handlers.errorHandler());
  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });
}

// Handling 404 Errors
app.use((req, res, next) => {
  const error = new Error("Page Not Found!");
  error.status = 404;
  next(error);
});

// Handling Server Errors
app.use((error, req, res, next) => {
  console.log(error.stack);
  sentry.logErrorToSentry(error);
  res.status(error.status || 500).json({ message: error.message || "Internal Server Error!" });
});

if (process.env.NEWRELIC_LICENSE_KEY.trim()) {
  let newrelic_app_name = "atom-" + process.env.NODE_ENV.trim();
  process.env.NEW_RELIC_APP_NAME = newrelic_app_name;
  process.env.NEW_RELIC_LICENSE_KEY = process.env.NEWRELIC_LICENSE_KEY;
  import("newrelic")
    .then(() => {
      console.log("Newrelic is running 👍");
    })
    .catch((err) => {
      sentry.logErrorToSentry(err);
      console.log("Newrelic is not running 👎");
    });
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
