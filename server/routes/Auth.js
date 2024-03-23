const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = mongoose.model("User");
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: "Đăng nhập thành công" });
    } else {
      res
        .status(401)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra đăng nhập:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi kiểm tra đăng nhập" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const user = await createUser(req.body);
    console.log(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

async function createUser({ username, email, phoneNumber, password }) {
  // Create a new user instance
  const user = new User({ username, email, phoneNumber, password });

  // Save the user to the database
  try {
    await user.save();
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

module.exports = router;
