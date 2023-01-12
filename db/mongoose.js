const mongoose = require("mongoose");
const connectionURL = process.env.NODE_ENV === "development" ? process.env.DB_URL : process.env.DB_URL;
// const connectionURL = process.env.DB_URL;

const connectMongoose = async () => {
  mongoose
    .connect(connectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Connected to MongoDB at ${connectionURL}`))
    .catch((err) => console.log(err));
};

connectMongoose();
