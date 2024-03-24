const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const admin = require("firebase-admin");
const User = require('../models/User');
const LoginInfo = require('../models/LoginInfo');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userSnapshot = await admin.database().ref(`users`).orderByChild('username').equalTo(username).once('value');
        const userData = userSnapshot.val();
        if (!userData)
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        const userId = Object.keys(userData)[0];
        const user = userData[userId];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).json({ message: 'Mật khẩu sai' });
        else{
            res.status(200).json({ message: 'Đăng nhập thành công' });
            const currentTime = new Date().toISOString();
            const newLoginInfo = new LoginInfo(username, currentTime);
            console.log("Thời gian hiện tại là:", currentTime);
            await admin.database().ref('logininfo').push(newLoginInfo);
        }
    }
    catch(error){
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
    }
});

router.post('/register', async (req, res) => {
    const { username, password, email, phoneNumber } = req.body;
    try {
        const snapshot = await admin.database().ref('users').orderByChild('username').equalTo(username).once('value');
        if (snapshot.exists()) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
        } 
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(username, hashedPassword, email, phoneNumber);
        await admin.database().ref('users').push(newUser);
        console.log('Đăng ký thành công');
        res.status(200).json({ message: 'Đăng ký thành công'});
    } catch (error) {
        console.error('Đã xảy ra lỗi khi đăng ký:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký' });
    }
});
module.exports = router;
