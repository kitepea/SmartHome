const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");
const adafruitClient = require('./adafruit');

//Connect to firebase
const serviceAccount = require("./dadn232-firebase-adminsdk-k09m5-2e30d03f74.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dadn232-default-rtdb.firebaseio.com"
});

const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.use(require('./routes/Auth'));
app.use(require('./routes/Room'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

