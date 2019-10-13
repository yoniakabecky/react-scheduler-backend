const functions = require("firebase-functions");
const firestore = require("../singleton/firestore");

const createSchedule = functions.https.onCall(async (data, _) => {
  //   const createAt = data["createAt"];
  //   const Schedule = data["Schedule"];
  //   const endAt = data["endAt"];
  const name = data["name"];
  const position = data["position"];
  const employeeId = data["employeeId"];

  const now = new Date();

  await firestore.collection("schedules").add({
    name: name,
    position: position,
    employeeId: employeeId
  });

  return null;
});

module.exports = createSchedule;
