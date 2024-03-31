const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const client = require('../adafruit');

//Get room data
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

//Toggle device on database
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

//Publish to adafruit
router.post('/publish_adafruit', async (req, res) => {
    // Add history to database
    var { feedName, value } = req.body;
    console.log("feedname: " + feedName);
    if (value)
        value = "1";
    else 
        value = "0";
    try {
        client.publish("trongtin213/feeds/" + feedName, value);
        return res.status(200).json({ message: 'Đã gửi dữ liệu lên adafruit' });
    }
    catch(error){
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
    }
});

router.post('/sendtime', async (req, res) => {
    var { roomname, type, index, timeOn, timeOff, state } = req.body;
    const feedName = roomname + '-' + type + '-' + String(index + 1);
    var value = feedName + ' ' + timeOn + ' ' + timeOff ;
    try {
        const roomSnapshot = await admin.database().ref(`rooms`).orderByChild('roomname').equalTo(roomname).once('value');
        const roomData = roomSnapshot.val();
        const roomId = Object.keys(roomData)[0];
        const room = roomData[roomId];
        if(type === "fans")
            var device = room.fans;
        if(type === "lights")
            var device = room.lights;
        if(state){
            device[index].sche_mode = true;
            device[index].ontime = timeOn;
            device[index].offtime = timeOff;
        }
        else{
            device[index].sche_mode = false;
            value = feedName + " OFF";
        }

        await admin.database().ref(`rooms/${roomId}`).update({ [type]: device });

        client.publish("trongtin213/feeds/sche-mode", value);
        return res.status(200).json({ message: 'Đã gửi dữ liệu lên adafruit' });
    }
    catch(error){
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
    }
});


module.exports = router;
