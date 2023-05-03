const express = require("express");
//const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
const dbConnection = require("./config/database");
const clientRouter = require("./routes/clientRoute");
const subUserRouter = require("./routes/subUserRoute");
const userRouter = require("./routes/userRoute");
const projectRouter = require("./routes/projectRoute");
const machineRouter = require("./routes/machineRoute");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

dotenv.config({ path: "config.env" });

//db Connection

dbConnection();

//seting up MongoDB database for our app
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`APP RUNNING ON PORT ${PORT}`);
});

//Middlewares

app.set("view engine", "ejs");
app.set("views", "views"); //the sencond 'views' is the name of our folder

//app.use(express.static(path.join(__dirname, "front/public")));

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

/*app.get("*", (req, res) => {
  //res.sendFile(__dirname+'\\views\\index.html')
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
  // process and plateform are both objects
  //(installed automatically with nodejs)
});*/

//Mount routes

app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subusers", subUserRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/machines", machineRouter);

app.all("*", (req, res, next) => {
  //create error and send it to error handling middleware
  //const err = new Error(`can't find this route: ${req.originalUrl}`)
  //next(err.message)
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
});

//Global error handling Middleware for express:

app.use(globalError);

//Handle rejections outside of express

process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutting down...");
    process.exit(1);
  });
});
