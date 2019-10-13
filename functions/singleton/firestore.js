const admin = require("firebase-admin");

const firestore = admin.initializeApp().firestore();

module.exports = firestore;
