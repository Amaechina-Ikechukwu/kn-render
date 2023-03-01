const functions = require("firebase-functions");
const express = require("express");
const service = require("./serviceaccountkey.json");
const cors = require("cors");
const app = express();
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

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
const getUniversities = require("./profile/getUniversities");
const setUniversity = require("./profile/setUniversity");
const universityList = require("./functions/universityapi");
app.use("/user", userRouter);
app.use("/getusers", getUser);
app.use("/createavatar", createAvatar);
app.use("/createuser", createuser);
app.use("/getuser", getuser);
app.use("/chatopenai", chatopenai);
app.use("/universities", getUniversities);
app.use("/setuniversity", setUniversity);
app.use("/u", universityList);

// // If modifying these scopes, delete token.json.
// const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = path.join(process.cwd(), "token.json");
// const CREDENTIALS_PATH = path.join(process.cwd(), "credential.json");

// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist() {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     return null;
//   }
// }

// /**
//  * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: "authorized_user",
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }

// /**
//  * Prints the names and majors of students in a sample spreadsheet:
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */
// async function listMajors(auth) {
//   const sheets = google.sheets({ version: "v4", auth });
//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId: process.env.SHEET_ID,
//     range: "Sheet1",
//   });
//   const rows = res.data.values;
//   if (!rows || rows.length === 0) {
//     console.log("No data found.");
//     return;
//   }
//   console.log("Name, Major:");
//   let list = [];
//   rows.forEach((row) => {
//     // Print columns A and E, which correspond to indices 0 and 4.
//     list.push({ rank: row[0], university: row[1] });
//   });
//   console.log(list);
// }

// authorize().then(listMajors).catch(console.error);

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
app.listen(process.env.PORT || 3000);
