const express = require("express");
const router = express.Router();
const { getAuth } = require("firebase-admin/auth");

router.post("/", async (req, res) => {
  const { body, headers } = req;
  const token = headers.authorization.split(" ")[1];
  if (headers.authorization == null || headers.authorization == undefined) {
    res.status(400).json({ message: "Please add headers" });
  } else {
    await getAuth()
      .getUser(token)
      .then(async () => {
        await getAuth()
          .updateUser(token, {
            publicProfile: body.publicProfile,
            university: body.university,
          })
          .then(() => res.status(200).json({ success: true }))
          .catch((err) => res.json({ success: false, message: err }));
      })
      .catch((err) =>
        res
          .status(401)
          .json({ success: false, message: `unauthenticated ${err}` })
      );
  }
});
module.exports = router;
