class History {
    constructor(username, romname, devicename, config, time) {
        this.username = username;
        this.romname = romname;
        this.devicename = devicename;
        this.config  = config ;
        this.time = time;
    }
}

module.exports = History;