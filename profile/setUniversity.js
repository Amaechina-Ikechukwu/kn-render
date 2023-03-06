const express = require("express");
const router = express.Router();
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");

router.post("/", async (req, res) => {
  const { body, headers } = req;
  const listOfParameter = [
    "public",
    "university",
    "town",
    "faculty",
    "department",
    "level",
  ];

  const inspectParamemter = () => {
    let emptyParam = [];
    listOfParameter.map((x) => {
      if (body.hasOwnProperty(x) == false) {
        emptyParam.push(x);
      }
    });

    return emptyParam;
  };

  const token = headers.authorization.split(" ")[1];

  if (headers.authorization == null || headers.authorization == undefined) {
    res.status(400).json({ message: "Please add headers" });
  } else {
    if (inspectParamemter().length > 0) {
      res.json({
        success: false,
        message: `please add ${inspectParamemter()}`,
      });
    }
    await admin
      .firestore()
      .collection("profile")
      .doc(token)
      .set(body)
      .then((e) => getProfile())
      .catch((err) => res.json({ success: false, message: err }));
    async function getProfile() {
      await getAuth()
        .getUser(token)
        .then(async (result) => {
          const snapshot = admin.firestore().collection("profile").doc(token);
          const userSecondaryData = await snapshot.get();
          const resultData = {
            name: result.displayName,
            email: result.email,
            emailVerified: result.emailVerified,
            phoneNumber: result.phoneNumber,
            photoUrl: result.photoURL,
            uid: result.uid,
          };
          const allProfile = Object.assign(
            resultData,
            userSecondaryData.data()
          );

          setProfile(allProfile);
          return;
        })
        .catch((e) => {
          console.log(e);
          res.json({ message: JSON.stringify(e) });
        });
    }

    async function setProfile(profile) {
      await admin
        .firestore()
        .collection(body.university)
        .doc("faculty")
        .collection(body.faculty)
        .doc("department")
        .collection(body.department)
        .doc("level")
        .collection(JSON.stringify(body.level))
        .doc("profile")
        .collection("profile")
        .doc(token)
        .set(profile)
        .then((e) => res.status(200).json({ success: true, message: e }))
        .catch((err) => res.json({ success: false, message: err }));
    }
    // await getAuth()
    //   .updateUser(token, {
    //     public: body.public,
    //     university: body.university,
    //     town: body.town,
    //     faculty: body.faculty,
    //     department: body.department,
    //     level: body.level,
    //   })
  }
});
module.exports = router;
