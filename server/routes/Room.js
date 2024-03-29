const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

router.post('/room', async (req, res) => {
    const { roomname } = req.body;
    try {
        const roomSnapshot = await admin.database().ref(`rooms`).orderByChild('roomname').equalTo(roomname).once('value');
        const roomData = roomSnapshot.val();
        const roomId = Object.keys(roomData)[0];
        const room = roomData[roomId];
        return res.status(200).json({ room });
    }
    catch(error){
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
    }
});

router.post('/toggle', async (req, res) => {
    const { roomname, type, index } = req.body;
    try {
        const roomSnapshot = await admin.database().ref(`rooms`).orderByChild('roomname').equalTo(roomname).once('value');
        const roomData = roomSnapshot.val();
        const roomId = Object.keys(roomData)[0];
        const room = roomData[roomId];
        if(type === "fans")
            var device = room.fans;
        if(type === "lights")
            var device = room.lights;

        device[index].state = !device[index].state;
        await admin.database().ref(`rooms/${roomId}`).update({ [type]: device });

        return res.status(200).json({ message: 'Đã cập nhật trạng thái' });
    }
    catch(error){
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
    }
});

module.exports = router;
