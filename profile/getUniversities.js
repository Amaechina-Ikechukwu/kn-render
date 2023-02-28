const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getAuth } = require("firebase-admin/auth");
router.get("/", async (req, res) => {
  const { authorization } = req.headers;
  let authorized = false;
  const options = {
    method: "GET",
    url: "https://nigeria-universites.p.rapidapi.com/universities/",
    headers: {
      "X-RapidAPI-Key": "21de8c241cmsh50d7f36e2ae4a27p1304d5jsn63d59a9197ea",
      "X-RapidAPI-Host": "nigeria-universites.p.rapidapi.com",
    },
  };
  if (authorization == null || authorization == undefined) {
    res.status(400).json({ message: "Please add headers" });
  } else {
    await getAuth()
      .getUser(authorization.split(" ")[1])
      .then(async (response) => {
        await axios
          .request(options)
          .then(function (response) {
            res.status(200).json({ success: true, data: response });
          })
          .catch(function (error) {
            res.json({ message: false, data: error });
          });
      })
      .catch((err) =>
        res
          .status(401)
          .json({ success: false, message: `unauthenticated ${err}` })
      );
  }
});
module.exports = router;
