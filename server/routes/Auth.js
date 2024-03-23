const express =require('express')
const router =express.Router()
const mongoose=require('mongoose')

const User = mongoose.model("User")
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        res.status(200).json({ message: "Đăng nhập thành công" });
      } else {
        res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng nhập:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi khi kiểm tra đăng nhập" });
    }
  });

module.exports=router