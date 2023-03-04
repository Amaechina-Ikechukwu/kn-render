const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const router = require("express").Router();
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credential.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
router.get("/", async (req, res) => {
  async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  }

  /**
   * Prints the names and majors of students in a sample spreadsheet:
   * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
   */ let list = [];
  async function listOfFaculties(auth) {
    const sheets = google.sheets({ version: "v4", auth });
    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range:
        req.body.sheet_name || req.params.sheet_name || req.query.sheet_name,
    });
    const rows = sheetData.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found.");
      return;
    }

    rows.forEach((row, index) => {
      list.push({ number: index + 1, faculties: row[0] });
    });
    const newList = list.filter(
      (x) => x.faculties !== "" && x.faculties !== undefined
    );
    res.status(200).json({ success: true, data: newList });
    return list;
  }

  authorize()
    .then(listOfFaculties)
    .catch((e) => {
      res.json({
        success: false,
        message: JSON.stringify(e),
      });
      return;
    });
});
module.exports = router;