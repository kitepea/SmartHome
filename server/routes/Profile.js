const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.get("/profile", async (req, res) => {
  try {
    const username = req.query.username;
    const userSnapshot = await admin
      .database()
      .ref("users")
      .orderByChild("username")
      .equalTo(username)
      .once("value");
    const userData = userSnapshot.val();
    if (!userData) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    const userArray = Object.values(userData);
    const user = userArray[0]; // Lấy người dùng đầu tiên khớp với username
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
});

router.post("/profile", async (req, res) => {
  const username = req.body.username;
  try {
    const userSnapshot = await admin
      .database()
      .ref("users")
      .orderByChild("username")
      .equalTo(username)
      .once("value");
    const userData = userSnapshot.val();
    if (!userData) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const userKey = Object.keys(userData)[0];
    const userRef = admin.database().ref("users/" + userKey);
    const updatedUser = req.body;

    try {
      await userRef.update(updatedUser);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});


module.exports = router;
