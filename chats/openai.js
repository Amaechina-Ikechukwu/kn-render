const router = require("express").Router();
const { Configuration, OpenAIApi } = require("openai");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post("/", async (req, res) => {
  const { message } = req.body;
  const { authorization } = req.headers;
  try {
    if (authorization == null || authorization == undefined) {
      res.json({ message: "please add headers" });
    } else {
      await getAuth()
        .getUser(authorization.split(" ")[1])
        .then(() => (authorized = true))
        .catch((err) => res.json({ success: false, message: err }));
      if (authorized) {
        await admin
          .firestore()
          .collection("chats")
          .doc(authorization.split(" ")[1])
          .collection("openai")
          .doc()
          .set({
            message,
            timestamp: FieldValue.serverTimestamp(),
            isRead: false,
            uid: authorization.split(" ")[1],
          })
          .then((result) => {})
          .catch((error) => {});
        await openai
          .createCompletion({
            model: "text-davinci-003",
            prompt: message,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
          })
          .then(async (result) => {
            await admin
              .firestore()
              .collection("chats")
              .doc(authorization.split(" ")[1])
              .collection("openai")
              .doc()
              .set({
                message: result.data.choices[0].text,
                timestamp: FieldValue.serverTimestamp(),
                isRead: false,
                uid: "openai",
              })
              .then(
                (result) => res.json({ success: true, message: result }),
                res.json({ success: true, result: result })
              )
              .catch((error) => res.json({ success: true, message: error }));
          })
          .catch((error) => {
            res.json({ success: false, message: error });
          });
      } else {
        res.json({ success: false, message: "unauthorized" });
      }
    }
  } catch (e) {}
});
module.exports = router;
