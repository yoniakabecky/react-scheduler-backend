const functions = require('firebase-functions');

const ping = functions.https.onRequest((_, res) => {
    res.status(200).send("pong");
});

module.exports = ping;
