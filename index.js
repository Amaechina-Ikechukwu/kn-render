const functions = require("firebase-functions");
const express = require("express");
const service = require("./serviceaccountkey.json");
const cors = require("cors");
const app = express();
require("dotenv").config();

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(service),
  storageBucket: process.env.S_B,
});
app.use(cors());
app.use(express.json());
const userRouter = require("./users/user");
const getUser = require("./users/readUsers");
const createAvatar = require("./profile/createAvatar");
const createuser = require("./users/createusers");
const getuser = require("./users/getusers");
const chatopenai = require("./chats/openai");
app.use("/.netlify/functions/api`/user", userRouter);
app.use("/.netlify/functions/api`/getusers", getUser);
app.use("/.netlify/functions/api`/createavatar", createAvatar);
app.use("/.netlify/functions/api`/createuser", createuser);
app.use("/.netlify/functions/api`/getuser", getuser);
app.use("/.netlify/functions/api`/chatopenai", chatopenai);

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
app.listen(process.env.PORT || 3000);
