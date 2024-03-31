class Room {
    constructor(roomname, temperature, humidity, brightness, fans, lights) {
        this.roomname = roomname;
        this.temperature = temperature;
        this.humidity = humidity;
        this.brightness  = brightness ;
        this.fans = fans;
        this.lights = lights;
    }
}

module.exports = Room;
