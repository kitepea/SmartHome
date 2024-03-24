class Fan {
    constructor(name, state, auto_mode, threshold, sche_mode, ontime, offtime) {
        this.name = name;
        this.state = state;
        this.auto_mode = auto_mode;
        this.threshold  = threshold ;
        this.sche_mode = sche_mode;
        this.ontime = ontime;
        this.offtime = offtime;
    }
}

module.exports = Fan;