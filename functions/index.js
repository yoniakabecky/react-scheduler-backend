const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require("./utils/fbAuth");

const {
  postOneSchedule,
  getSchedule,
  getMySchedule,
  getScheduleByUserName,
  getMonthSchedules,
  getDaySchedules,
  deleteSchedule,
  editSchedule
  // postSchedules,
} = require("./handlers/schedules");

const {
  signup,
  signin,
  getAuthenticatedUser
  // uploadImage,
  // addUserDetails,
  // getUserDetails,
  // getAvailabilities,
  // postAvailabilities
} = require("./handlers/employees");

// TODO: make middleware for admin check

// Schedules Routes
app.post("/schedule", FBAuth, postOneSchedule); // admin
app.get("/schedules/schedule/:scheduleId", FBAuth, getSchedule);
app.get("/schedules/mySchedules", FBAuth, getMySchedule);
app.post("/schedules/userSchedules", FBAuth, getScheduleByUserName);
app.get("/schedules/mySchedules/month/:yyyy/:mm", FBAuth, getMonthSchedules);
app.get("/schedules/mySchedules/day/:yyyy/:mm/:dd", FBAuth, getDaySchedules);
app.delete("/schedules/schedule/:scheduleId", FBAuth, deleteSchedule); // admin
app.put("/schedules/schedule/:scheduleId", FBAuth, editSchedule); // admin
// app.post("/schedules", FBAuth, postSchedules); // admin

// Employees Routes
app.post("/signup", signup);
app.post("/signin", signin);
app.get("/user", FBAuth, getAuthenticatedUser);
// app.post("/user/image", FBAuth, uploadImage);
// app.post('/user', FBAuth, addUserDetails);
// app.get('/user/:userName', FBAuth, getUserDetails);
// app.get("/user/:userName/availabilities", FBAuth, getAvailabilities);
// app.post("/user/:userName/availabilities", FBAuth, postAvailabilities);

// TODO: Companies Routes
// app.post("/company/signup", FBAuth, addAnEmployee); // admin

exports.api = functions.https.onRequest(app);
