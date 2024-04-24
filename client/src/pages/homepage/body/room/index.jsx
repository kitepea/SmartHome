import {memo, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import './style.css'
import CircularSlider from '@fseehawer/react-circular-slider';
import { TbArrowBackUp } from "react-icons/tb";
import { BsFan } from "react-icons/bs";
import { FaLightbulb } from "react-icons/fa6";
import Chart from '../../../../components/LineChart';
import { useNavigate } from 'react-router-dom';

const Room = () =>{
    const { roomname } =    useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOnFan , settimeOnFan] = useState("");
    const [timeOffFan , settimeOffFan] = useState("");
    const [timeOnLight , settimeOnLight] = useState("");
    const [timeOffLight , settimeOffLight] = useState("");
    const [upper_threshold_fan, setUpperThreshold_fan] = useState(0);
    const [lower_threshold_fan, setLowerThreshold_fan] = useState(0);
    const [upper_threshold_light, setUpperThreshold_light] = useState(0);
    const [lower_threshold_light, setLowerThreshold_light] = useState(0);
    const navigate = useNavigate();

    const data = [
        { name: '00:00', value1: 13, value2: 20, value3: 10 },
        { name: '01:00', value1: 24, value2: 30, value3: 67 },
        { name: '02:00', value1: 34, value2: 24, value3: 54 },
        { name: '03:00', value1: 32, value2: 22, value3: 30 },
        { name: '04:00', value1: 23, value2: 38, value3: 20 },
        { name: '05:00', value1: 23, value2: 39, value3: 10 },
        { name: '06:00', value1: 30, value2: 36, value3: 50 },
        { name: '07:00', value1: 29, value2: 50, value3: 40 },
        { name: '08:00', value1: 26, value2: 45, value3: 30 },
        { name: '09:00', value1: 33, value2: 30, value3: 20 },
        { name: '10:00', value1: 30, value2: 35, value3: 70 },
        { name: '11:00', value1: 34, value2: 36, value3: 60 },
        { name: '12:00', value1: 35, value2: 37, value3: 50 },
        { name: '13:00', value1: 24, value2: 38, value3: 40 },
        { name: '14:00', value1: 27, value2: 40, value3: 30 },
        { name: '15:00', value1: 29, value2: 30, value3: 20 },
        { name: '16:00', value1: 27, value2: 20, value3: 10 },
        { name: '17:00', value1: 28, value2: 30, value3: 67 },
        { name: '18:00', value1: 39, value2: 40, value3: 54 },
        { name: '19:00', value1: 30, value2: 50, value3: 30 },
        { name: '20:00', value1: 34, value2: 35, value3: 20 },
        { name: '21:00', value1: 36, value2: 40, value3: 10 },
        { name: '22:00', value1: 24, value2: 50, value3: 50 },
        { name: '23:00', value1: 21, value2: 60, value3: 40 }
    ];
    
    const lines = [
        { key: 'value1', label: 'Temperature', color: '#FF0000' },
        { key: 'value2', label: 'Humidity', color: '#0000FF' },
        { key: 'value3', label: 'Brightness', color: '#FFFF00' },
    ];

    const handleReturn = (event) => {
        navigate('/home');
    };
    const handleLowerThresholdChangeFan = (value) => {
        setLowerThreshold_fan(value);
    };
    const handleLowerThresholdChangeLight = (value) => {
        setLowerThreshold_light(value);
    };
    const handleUpperThresholdChangeFan = (value) => {
        setUpperThreshold_fan(value);
    };
    const handleUpperThresholdChangeLight = (value) => {
        setUpperThreshold_light(value);
    };
    const handleSwitchChangeFan = () => {
        Publish(roomname, "fans", 0, !room.fans[0].state);
    };
    const handleSwitchChangeLight = () => {
        Publish(roomname, "lights", 0, !room.lights[0].state);
    };
  // History, add time, place, user who trigger
  const Publish = async (roomname, type, index, value) => {
    const feedName = roomname + "-" + type + "-" + String(index + 1);
    try {
      const response = await fetch("http://localhost:5000/publish_adafruit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedName, value }),
      });
      console.log(response);
    } catch (error) {
      alert(error.message);
    }
  };

    const scheMode = async(roomname, type, index, timeOn, timeOff, state) =>{
        const timeOnString = timeOn.toString();
        const timeOffString = timeOff.toString();
        try {
            const response = await fetch("http://localhost:5000/sendtime", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomname, type, index, timeOn: timeOnString, timeOff: timeOffString, state })
            });
            console.log(response);
        } catch (error) {
            alert(error.message);
        }
        
    }

    const autoMode = async(roomname, type, index, lower_threshold, upper_threshold, state) =>{
        try {
            const response = await fetch("http://localhost:5000/sendthreshold", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomname, type, index, lower_threshold, upper_threshold, state })
            });
            console.log(response);
        } catch (error) {
            alert(error.message);
        }
        
    }

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await fetch("http://localhost:5000/room", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ roomname })
                });
                const data = await response.json();
                const roomData = data.room;
                setRoom(roomData);
                setLoading(false);
            } catch (error) {
                alert(error.message);
            }
        };

    fetchRoomData();

    const intervalId = setInterval(fetchRoomData, 1000);
    // Note clearInterval
    return () => clearInterval(intervalId);
  }, [roomname]);

    if (loading) {
        return <p>Loading...</p>;
    }
    else if(!room.fans){
        return <p>None</p>
    } 
    return (
        <div class = "container py-3">
            <section class = "section_top">
                <div class = "container">
                    <div class = "row">
                        <div class="col-md-4 info">
                            <div class="row back">
                                <div class="col-md-4 px-0 btnout">
                                    <button onClick={handleReturn} type="button" className="btn">
                                        <TbArrowBackUp />
                                    </button>                                
                                </div>
                                
                                <div class="col-md-8 pt-3 px-5">
                                    <h3>Go Back</h3>
                                </div>
                            </div>
                            <div class = "row mt-4 pe-4">
                                <div class = "col-md-6">
                                    <img class="roomimg" src="https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2023/7/19/3/DOTY2023_Dramatic-Before-And-Afters_Hidden-Hills-11.jpg.rend.hgtvcom.616.411.suffix/1689786863909.jpeg" 
                                        alt="living" />
                                </div>
                                <div class="col-md-6 pt-2 roomname">
                                    <h3>
                                        {roomname.toUpperCase()}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7 py-2 ms-3 chart">
                            <Chart data={data} ynames={lines} domains={[-50, 100]} />
                        </div>
                    </div>
                </div>
            </section>
            <section class="mt-5">
                <div class="container fan">
                    <div class="row py-4 px-4">
                        <div class="col-md-5">
                            <div class="row switch-fan py-4 px-3">
                                <div class="col-md-4">
                                    <BsFan className={room.fans[0].state ? "rotate rotate-on" : "rotate"} />
                                </div>
                                <div class="col-md-4 ms-4 mt-4">
                                    <div className = "form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            checked={room.fans[0].state}
                                            onChange={handleSwitchChangeFan}
                                        />
                                    </div>                         
                                </div>
                            </div>
                            <div class="schedule-fan mt-3 px-4 py-4">
                                <h4>Schedule mode</h4>
                                <div class="schedule-fan-state">
                                    {room.fans[0].sche_mode? (
                                        <div>
                                            <p>The fan will be turned on at <strong>{room.fans[0].ontime}</strong> and turned off at <strong>{room.fans[0].offtime}</strong></p>
                                            <button class="btn btn-danger" onClick={() => scheMode( roomname, "fans", 0, timeOnFan, timeOffFan, false)}>
                                                Disable
                                            </button>
                                        </div>
                                    ) : <p>Schedule mode is <strong style={{ color: 'red' }}>OFF</strong></p>}
                                </div>
                                <div class="form-floating">
                                    <input
                                        type="time"
                                        class="form-control"
                                        id="ontime"
                                        onChange={(e) => settimeOnFan(e.target.value)}
                                        required
                                    />
                                    <label for="ontime">On time</label>
                                </div>
                                <div class="form-floating mt-2">
                                    <input
                                        type="time"
                                        class="form-control"
                                        id="offtime"
                                        onChange={(e) => settimeOffFan(e.target.value)}
                                        required
                                    />
                                    <label for="offtime">Off time</label>
                                </div>
                                
                                <button class="btn btn-success mt-2" onClick={() => {
                                    if (!timeOnFan || !timeOffFan) {
                                        alert('Vui lòng chọn thời gian');
                                    } else {
                                        scheMode(roomname, "fans", 0, timeOnFan, timeOffFan, true);
                                    }
                                }}>
                                    Active  
                                </button>    
                            </div>
                        </div>
                        <div class="col-md-6 ms-5 px-4 py-4 auto-fan">
                            <h4>Automatic mode</h4>
                            <div class="auto-fan-state">
                                {room.fans[0].auto_mode? (
                                    <div>
                                        <p>Thresh hold is <strong>{room.fans[0].lower_threshold}°C</strong></p>
                                        <button class="btn btn-danger" onClick={() => autoMode( roomname, "fans", 0, lower_threshold_fan, upper_threshold_fan, false)}>
                                            Disable
                                        </button>
                                    </div>
                                ) : <p>Automatic mode is <strong>OFF</strong></p>} 
                            </div>
                            <div class="row mt-3 d-flex justify-content-center align-items-center">
                                <div class="col-md-6">
                                    <CircularSlider
                                        labelColor="#005a58"
                                        knobColor="#005a58"
                                        progressColorFrom="#009c9a"
                                        progressSize={24}
                                        trackSize={24}
                                        max={100}
                                        min={0}
                                        label = "Off at (°C )"
                                        onChange={handleLowerThresholdChangeFan}
                                    />
                                </div>
                                <div class="mt-3 auto-btn">
                                    <button class="btn btn-success" onClick={() => {
                                        if (!lower_threshold_fan) {
                                            alert('Vui lòng đặt ngưỡng');
                                        }
                                        else {
                                            autoMode(roomname, "fans", 0, lower_threshold_fan, 0, true);
                                        }
                                    }}>
                                        Active
                                    </button>
                                </div>
                            </div>                               
                        </div>
                    </div>
                </div>
            </section>
            <section class="mt-5">
                <div class="container light">
                    <div class="row py-4 px-4">
                        <div class="col-md-5">
                            <div class="row switch-light py-4 px-3">
                                <div class="col-md-4">
                                    <FaLightbulb style={{ color: room.lights[0].state ? 'yellow' : 'initial', fontSize: '120px' }} />
                                </div>
                                <div class="col-md-4 ms-4 mt-4">
                                    <div className = "form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            checked={room.lights[0].state}
                                            onChange={handleSwitchChangeLight}
                                        />
                                    </div>                         
                                </div>
                            </div>
                            <div class="schedule-light mt-3 px-4 py-4">
                                <h4>Schedule mode</h4>
                                <div class="schedule-light-state">
                                    {room.lights[0].sche_mode? (
                                        <div>
                                            <p>The light will be turned on at <strong>{room.lights[0].ontime}</strong> and turned off at <strong>{room.lights[0].offtime}</strong></p>
                                            <button class="btn btn-danger" onClick={() => scheMode( roomname, "lights", 0, timeOnLight, timeOffLight, false)}>
                                                Disable
                                            </button>
                                        </div>
                                    ) : <p>Schedule mode is <strong style={{ color: 'red' }}>OFF</strong></p>}
                                </div>
                                <div class="form-floating">
                                    <input
                                        type="time"
                                        class="form-control"
                                        id="ontime"
                                        onChange={(e) => settimeOnLight(e.target.value)}
                                        required
                                    />
                                    <label for="ontime">On time</label>
                                </div>
                                <div class="form-floating mt-2">
                                    <input
                                        type="time"
                                        class="form-control"
                                        id="offtime"
                                        onChange={(e) => settimeOffLight(e.target.value)}
                                        required
                                    />
                                    <label for="offtime">Off time</label>
                                </div>
                                
                                <button class="btn btn-success mt-2" onClick={() => {
                                    if (!timeOnLight || !timeOffLight) {
                                        alert('Vui lòng chọn thời gian');
                                    } else {
                                        scheMode(roomname, "lights", 0, timeOnLight, timeOffLight, true);
                                    }
                                }}>
                                    Active  
                                </button>    
                            </div>
                        </div>
                        <div class="col-md-6 ms-5 px-4 py-4 auto-light">
                            <h4>Automatic mode</h4>
                            <div class="auto-light-state">
                                {room.lights[0].auto_mode? (
                                    <div>
                                        <p>Thresh hold is <strong>{room.lights[0].lower_threshold}%</strong></p>
                                        <button class="btn btn-danger" onClick={() => autoMode( roomname, "lights", 0, lower_threshold_light, upper_threshold_light, false)}>
                                            Disable
                                        </button>
                                    </div>
                                ) : <p>Automatic mode is <strong>OFF</strong></p>} 
                            </div>
                            <div class="row mt-3 d-flex justify-content-center align-items-center">
                                <div class="col-md-6">
                                    <CircularSlider
                                        labelColor="#005a58"
                                        knobColor="#005a58"
                                        progressColorFrom="#009c9a"
                                        progressSize={24}
                                        trackSize={24}
                                        max={100}
                                        min={0}
                                        label = "On at (% )"
                                        onChange={handleLowerThresholdChangeLight}
                                    />
                                </div>
                                <div class="mt-3 auto-btn">
                                    <button class="btn btn-success" onClick={() => {
                                        if (!lower_threshold_light) {
                                            alert('Vui lòng đặt ngưỡng');
                                        }
                                        else {
                                            autoMode(roomname, "lights", 0, lower_threshold_light, 0, true);
                                        }
                                    }}>
                                        Active
                                    </button>
                                </div>
                            </div>                               
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}   
export default memo(Room);
