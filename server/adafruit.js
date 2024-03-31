const axios = require('axios');

var mqtt = require("mqtt");

var client = mqtt.connect("mqtts://io.adafruit.com", {
  username: "trongtin213", // replace with username
  password: "aio_sZrl97SsckF4DCGCTfCys6RLOoCL", // replace with AIO_KEY
});

client.on("connect", function () {
  console.log("Connected to Adafruit IO MQTT Broker");
  client.subscribe("trongtin213/feeds/living-fans-1");
  client.subscribe("trongtin213/feeds/living-lights-1");
  client.subscribe("trongtin213/feeds/bed-fans-1");
  client.subscribe("trongtin213/feeds/bed-lights-1");
  client.subscribe("trongtin213/feeds/kitchen-fans-1");
  client.subscribe("trongtin213/feeds/kitchen-lights-1");
  client.subscribe("trongtin213/feeds/wc-lights-1");
  client.subscribe("trongtin213/feeds/sche-mode");

});

client.on("message", function (topic, message) {
  const topicParts = topic.split('/');
  const feedName = topicParts[topicParts.length - 1];
  console.log("Message:",feedName, message.toString());  
  const data = feedName.split('-');
  if(!(feedName === "sche-mode"))
    axios.post('http://localhost:5000/toggle', {
      roomname : data[0],
      type : data[1],
      index :  Number(data[2])-1
    })
});

module.exports = client;
