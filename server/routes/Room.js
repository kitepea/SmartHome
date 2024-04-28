const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const {client} = require("../adafruit");
const History= require('../models/History')

// const SSE = require("express-sse");
// const sse = new SSE();

//Get room data
router.post("/room", async (req, res) => {
  const { roomname } = req.body;
  try {
    const roomSnapshot = await admin
      .database()
      .ref(`rooms`)
      .orderByChild("roomname")
      .equalTo(roomname)
      .once("value");
    const roomData = roomSnapshot.val();
    const roomId = Object.keys(roomData)[0];
    const room = roomData[roomId];
    return res.status(200).json({ room });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
});

//Toggle device on database
router.post("/toggle", async (req, res) => {
  const { roomname, type, index } = req.body;
  try {
    const roomSnapshot = await admin
      .database()
      .ref(`rooms`)
      .orderByChild("roomname")
      .equalTo(roomname)
      .once("value");
    const roomData = roomSnapshot.val();
    const roomId = Object.keys(roomData)[0];
    const room = roomData[roomId];
    if (type === "fans") var device = room.fans;
    if (type === "lights") var device = room.lights;
    if(type === "door"){
      room.door = !room.door;
      await admin
      .database()
      .ref(`rooms/${roomId}`)
      .update(room);
      return res.status(200).json({ message: "Đã cập nhật trạng thái" });
    }
    device[index].state = !device[index].state;
    await admin
      .database()
      .ref(`rooms/${roomId}`)
      .update({ [type]: device });

    return res.status(200).json({ message: "Đã cập nhật trạng thái" });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
});

//Publish to adafruit
router.post("/publish_adafruit", async (req, res) => {
  // Add history to database
  var { feedName, value } = req.body;
  if (value) value = "1";
  else value = "0";
  try {
    client.publish("trongtin213/feeds/" + feedName, value);
    return res.status(200).json({ message: "Đã gửi dữ liệu lên adafruit" });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
});
router.post("/history", async (req, res) => {
  // Add history to database
  var {roomname, type, index, value, username } = req.body;
  if(type === "fans")
    var devicename = "FAN";
  else if(type === "lights")
    var devicename = "LIGHT";
  else var devicename = "DOOR";
  if(value)
    var history = new History(username, roomname, devicename, "ON", new Date().toLocaleString("vi-VN"));
  else
  var history = new History(username, roomname, devicename, "OFF", new Date().toLocaleString("vi-VN"));

  try {
    await admin.database().ref('history').push(history);
    return res.status(200).json({ message: "Đã gửi dữ liệu lên adafruit" });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
});
router.post("/history-info", async (req, res) => {
  try {
    const historyInfoSnapshot = await admin.database().ref('history').once('value');
    const historyInfoData = historyInfoSnapshot.val();
    const historyInfoArray = Object.values(historyInfoData);
    return res.status(200).json( {historyInfo: historyInfoArray });
}
catch(error){
    console.error('Đã xảy ra lỗi:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
}
});

router.post("/sendtime", async (req, res) => {
  var { roomname, type, index, timeOn, timeOff, state } = req.body;
  const feedName = roomname + "-" + type + "-" + String(index + 1);
  if(type === "fans")
    var value = "FAN/SCH/" + timeOn + "-" + timeOff + "/";
  else
    var value = "LIGHT/SCH/" + timeOn + "-" + timeOff + "/";
  try {
    const roomSnapshot = await admin
      .database()
      .ref(`rooms`)
      .orderByChild("roomname")
      .equalTo(roomname)
      .once("value");
    const roomData = roomSnapshot.val();
    const roomId = Object.keys(roomData)[0];
    const room = roomData[roomId];
    if (type === "fans") var device = room.fans;
    if (type === "lights") var device = room.lights;
    if (state) {
      device[index].sche_mode = true;
      device[index].ontime = timeOn;
      device[index].offtime = timeOff;
      value+="ON";
    } else {
      device[index].sche_mode = false;
      value  += "OFF";
    }
    await admin
      .database()
      .ref(`rooms/${roomId}`)
      .update({ [type]: device });

    client.publish("trongtin213/feeds/sche-mode", value);
    return res.status(200).json({ message: "Đã gửi dữ liệu lên adafruit" });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
});

router.post("/sendthreshold", async (req, res) => {
  var { roomname, type, index, lower_threshold, upper_threshold, state } =
    req.body;
  const feedName = roomname + "-" + type + "-" + String(index + 1);
  if(type === "fans")
    var value = "FAN/TH/" + lower_threshold + "/";
  else
    var value = "LIGHT/TH/" + lower_threshold + "/";
  try {
    const roomSnapshot = await admin
      .database()
      .ref(`rooms`)
      .orderByChild("roomname")
      .equalTo(roomname)
      .once("value");
    const roomData = roomSnapshot.val();
    const roomId = Object.keys(roomData)[0];
    const room = roomData[roomId];
    if (type === "fans") var device = room.fans;
    if (type === "lights") var device = room.lights;
    if (state) {
      device[index].auto_mode = true;
      device[index].lower_threshold = lower_threshold;
      device[index].upper_threshold = upper_threshold;
      value += "ON"
    } else {
      device[index].auto_mode = false;
      value += "OFF";
    }
    await admin
      .database()
      .ref(`rooms/${roomId}`)
      .update({ [type]: device });

    client.publish("trongtin213/feeds/auto-mode", value);
    return res.status(200).json({ message: "Đã gửi dữ liệu lên adafruit" });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
});

router.post("/set_environment", async (req, res) => {
  const { envi, parameter } = req.body;
  const roomname = "living";
  try {
    const roomSnapshot = await admin
      .database()
      .ref(`rooms`)
      .orderByChild("roomname")
      .equalTo(roomname)
      .once("value");
    const roomData = roomSnapshot.val();
    const roomId = Object.keys(roomData)[0];
    const room = roomData[roomId];

    if (envi === "temperature") {
      if (!room.temperature) {
        room.temperature = [];
      }
      if (room.temperature.length === 10) {
        room.temperature.shift();
      }
      room.temperature.push(parseInt(parameter));
    } else if (envi === "brightness") {
      if (!room.brightness) {
        room.brightness = [];
      }
      if (room.brightness.length === 10) {
        room.brightness.shift();
      }
      room.brightness.push(parseInt(parameter));
    } else {
      if (!room.humidity) {
        room.humidity = [];
      }
      if (room.humidity.length === 10) {
        room.humidity.shift();
      }
      room.humidity.push(parseInt(parameter));
    }
    
    await admin.database().ref(`rooms/${roomId}`).update(room);
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
});


module.exports = router;
