const express = require("express");
const logger = require('morgan');
const cors = require("cors");
const app = express();

// Routes
const userRouter = require("./routers/user");
const eventRouter = require("./routers/event");
const auditRouter = require("./routers/audit");
const domainRouter = require("./routers/domain");
const projectRouter = require("./routers/project");
const goodiesRouter = require("./routers/goodies");
const taskRouter = require("./routers/task");
const adminRouter = require("./admin/routers");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://atom.think-digital.in", "https://atomstg.think-digital.in", "https://atomthinkdigital.netlify.app", "https://td-teamdirectory.netlify.app", "https://atomstg.netlify.app", "https://tdatom.netlify.app"],
  })
);
app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

require("dotenv").config();
require("./db/mongoose");

app.use(userRouter);
app.use(eventRouter);
app.use(auditRouter);
app.use(domainRouter);
app.use(projectRouter);
app.use(goodiesRouter);
app.use(taskRouter);
app.use(adminRouter);

// Handling 404 Errors
app.use((req, res, next) => {
  const error = new Error("Page Not Found!");
  error.status = 404;
  next(error);
});

// Handling Server Errors
app.use((error, req, res, next) => {
  console.log(error.stack);
  res.status(error.status || 500).json({ message: error.message || "Internal Server Error!" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
