const admin = require("firebase-admin");
const serviceAccount = require('../react-scheduler-3578053f78f4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://react-scheduler-3578053f78f4.firebaseio.com"
});

const firestore = admin.firestore();

module.exports = { admin, firestore };
