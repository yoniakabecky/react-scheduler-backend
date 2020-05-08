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

exports.getMySchedule = async (req, res) => {
  await firestore
    .collection("schedules")
    .where("assignedTo", "==", req.user.userName)
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

exports.getScheduleByUserName = async (req, res) => {
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

exports.getMonthSchedules = (req, res) => {
  const { yyyy, mm } = req.params;
  let day = `${yyyy}-${mm}`;

  getSchedulesByDate(req, res, day);
};

exports.getDaySchedules = (req, res) => {
  const { yyyy, mm, dd } = req.params;
  let day = `${yyyy}-${mm}-${dd}`;

  getSchedulesByDate(req, res, day);
};

const getSchedulesByDate = async (req, res, date) => {
  await firestore
    .collection("schedules")
    .orderBy("startAt")
    .get()
    .then(data => {
      let schedules = [];
      data.forEach(doc => {
        const startAt = doc.data().startAt;
        if (startAt.startsWith(date)) schedules.push(doc.data());
      });
      return res.json(schedules);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deleteSchedule = async (req, res) => {
  const document = firestore.doc(`/schedules/${req.params.scheduleId}`);

  await document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Schedule not found" });
      }
      return document.delete();
    })
    .then(() => {
      return res.status(204).json({ message: "Document deleted" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.editSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  const {
    startAt,
    endAt,
    assignedTo,
    position,
    companyName,
    createdAt,
    createdBy
  } = req.body;

  const document = firestore.doc(`/schedules/${scheduleId}`);

  const schedule = {
    startAt,
    endAt,
    assignedTo,
    position,
    companyName,
    createdAt,
    createdBy,
    updatedAt: new Date().toISOString(),
    updatedBy: req.user.userName
  };

  await document
    .set(schedule)
    .then(() => {
      res.json({ message: `document ${scheduleId} updated successfully` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
};
