var mqtt = require("mqtt");
var client = mqtt.connect("mqtts://io.adafruit.com", {
  username: "", // replace with username
  password: "", // replace with AIO_KEY
});

client.on("connect", function () {
  client.subscribe("kitepea/feeds/bbc-led"); // replace with bbc-led or bbc-temp
});

client.on("message", function (topic, message) {
  console.log(message.toString());
});
