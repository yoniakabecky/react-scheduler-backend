const { firestore } = require("../singleton/firestore");

exports.postOneSchedule = (req, res) => {
  const newSchedule = {
    createdAt: new Date().toISOString(),
    startAt: req.body.startAt,
    endAt: req.body.endAt,
    assignedTo: req.body.assignedTo,
    position: req.body.position,
    companyName: req.body.companyName,
    createdBy: req.user.userName
  };

  firestore
    .collection("schedules")
    .add(newSchedule)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
};

exports.getSchedule = async (req, res) => {
  await firestore
    .doc(`/schedules/${req.params.scheduleId}`)
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).json({ error: "Schedule not found" });
      let scheduleData = doc.data();
      scheduleData.scheduleId = doc.id;
      return res.json(scheduleData);
    })
    .catch(err => console.error(err));
};

exports.getMySchedules = async (req, res) => {
  await firestore
    .collection("schedules")
    .where("assignedTo", "==", req.body.userName)
    .get()
    .then(data => {
      let schedules = [];
      data.forEach(doc => {
        schedules.push(doc.data());
      });
      return res.json(schedules);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
