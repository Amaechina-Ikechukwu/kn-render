const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");
const router = require("express").Router();
router.get("/", async (req, res) => {
  const { headers, body } = req;
  const token = headers.authorization.split(" ")[1];

  if (token == null || token == undefined) {
    res.json({ message: "please add headers" });
  } else {
    let profile = [];
    await getAuth()
      .getUser(token)
      .then(async (result) => {
        const snapshot = admin.firestore().collection("profile").doc(token);
        const userSecondaryData = await snapshot.get();
        const allProfile = Object.assign(result, userSecondaryData.data());

        res.json({ success: true, data: allProfile });
      })
      .catch((e) => {
        res.json({ message: e });
      });
  }
});

module.exports = router;
