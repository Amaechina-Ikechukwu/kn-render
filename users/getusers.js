const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");
const router = require("express").Router();
router.get("/", async (req, res) => {
  const { headers, body } = req;
  const token = headers.authorization.split(" ")[1];

  if (headers.authorization == null || headers.authorization == undefined) {
    res.json({ message: "please add headers" });
  } else {
    let profile = [];
    await getAuth()
      .getUser(token)
      .then((result) => profile.push(...result))
      .catch(() => {});
    const snapshot = admin.firestore().collection("profile").doc(token);
    const userSecondaryData = await snapshot.get();

    profile.push(userSecondaryData.data());

    console.log(profile);
    res.json({});
  }
});

module.exports = router;
