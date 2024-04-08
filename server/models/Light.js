class Light {
    constructor(name, state, auto_mode,upper_threshold, lower_threshold, sche_mode, ontime, offtime) {
        this.name = name;
        this.state = state;
        this.auto_mode = auto_mode;
        this.upper_threshold  = upper_threshold ;
        this.lower_threshold  = lower_threshold ;
        this.sche_mode = sche_mode;
        this.ontime = ontime;
        this.offtime = offtime;
    }
}

module.exports = Light;