const { admin, firestore } = require("../singleton/firestore");

const config = require("../utils/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignupData,
  validateSigninData
} = require("../utils/validators");

exports.signup = (req, res) => {
  const newEmployee = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userName: req.body.userName
  };

  const { valid, errors } = validateSignupData(newEmployee);

  if (!valid) return res.status(400).json({ errors });

  const noImg = "no-img.png";

  let token, employeeId;
  firestore
    .doc(`/employees/${newEmployee.userName}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ userName: "this user name is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(
            newEmployee.email,
            newEmployee.password
          );
      }
    })
    .then(data => {
      employeeId = data.user.uid;
      console.log("employee id", employeeId);
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        userName: newEmployee.userName,
        email: newEmployee.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        employeeId
      };
      return firestore
        .doc(`/employees/${newEmployee.userName}`)
        .set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

exports.signin = (req, res) => {
  const employee = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateSigninData(employee);

  if (!valid) return res.status(400).json({ errors });

  firebase
    .auth()
    .signInWithEmailAndPassword(employee.email, employee.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password")
        return res
          .status(403)
          .json({ general: "Wrong credentials, prase try again" });
      return res.status(500).json({ error: err.code });
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};

  firestore.doc(`/employees/${req.user.userName}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        return res.json(userData);
      } else {
        return res.status(404).json({ error: "User not found" })
      }
    })
    .catch(err => res.status(500).json({ error: err.code }));
};
