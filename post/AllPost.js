const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const db = admin.firestore();
router.post("/", async (req, res) => {
  let post = [];

  const postRef = db.collection("post");

  const snapshot = await postRef.get();
  snapshot.forEach((doc) => {
    post.push(doc.id);
  });
  res.status(200).json({ success: true, data: post });
  // console.log({ registerUser });
  // return res.status(200).json(registerUser);
});

module.exports = router;
