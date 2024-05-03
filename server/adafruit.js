const axios = require("axios");
const SSE = require("express-sse");
const sse = new SSE();

var mqtt = require("mqtt");

var client = mqtt.connect("mqtts://io.adafruit.com", {
  username: "trongtin213", // replace with username
  password: "", // replace with AIO_KEY
});

client.on("connect", function () {
  console.log("Connected to Adafruit IO MQTT Broker");
  client.subscribe("trongtin213/feeds/living-fans-1");
  client.subscribe("trongtin213/feeds/living-lights-1");
  client.subscribe("trongtin213/feeds/sche-mode");
  client.subscribe("trongtin213/feeds/auto-mode");
  client.subscribe("trongtin213/feeds/temperature");
  client.subscribe("trongtin213/feeds/brightness");
  client.subscribe("trongtin213/feeds/humidity");
  client.subscribe("trongtin213/feeds/living-door-1");
});

client.on("message", function (topic, message) {
  const topicParts = topic.split("/");
  const feedName = topicParts[topicParts.length - 1];
  // console.log("Message from adafruit.js:", feedName, message.toString());

  var data = feedName.split("-");
  if (
    feedName === "temperature" ||
    feedName === "brightness" ||
    feedName === "humidity"
  ) {
    axios.post("http://localhost:5000/set_environment", {
      envi: feedName,
      parameter: message.toString(),
    });
  } else if (!(feedName === "sche-mode" || feedName === "auto-mode")) {
    axios.post("http://localhost:5000/toggle", {
      roomname: data[0],
      type: data[1],
      index: Number(data[2]) - 1,
    });
  }
});

module.exports = { client, sse };
