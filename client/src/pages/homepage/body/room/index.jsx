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
    const username = localStorage.getItem('username')
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOnFan , settimeOnFan] = useState("");
    const [timeOffFan , settimeOffFan] = useState("");
    const [timeOnLight , settimeOnLight] = useState("");
    const [timeOffLight , settimeOffLight] = useState("");
    const [lower_threshold_fan, setLowerThreshold_fan] = useState(0);
    const [lower_threshold_light, setLowerThreshold_light] = useState(0);
    const navigate = useNavigate();

    
    const handleReturn = (event) => {
        navigate('/home');
    };
    const handleLowerThresholdChangeFan = (value) => {
        setLowerThreshold_fan(value);
    };
    const handleLowerThresholdChangeLight = (value) => {
        setLowerThreshold_light(value);
    };

    const handleSwitchChangeFan = () => {
        Publish(roomname, "fans", 0, !room.fans[0].state);
        History(roomname, 'fans', 0, !room.fans[0].state, username);
    };
    const handleSwitchChangeLight = () => {
        Publish(roomname, "lights", 0, !room.lights[0].state);
        History(roomname, 'lights', 0, !room.lights[0].state, username);

    };

    const handleSwitchChangeDoor = () => {
        Publish(roomname, "door", 0, !room.door);
        History(roomname, 'door', 0, !room.door, username);
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
  const History = async (roomname, type, index, value, username) => {
    try {
      const response = await fetch("http://localhost:5000/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({roomname, type, index, value, username}),
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
  
const lines = [
    { key: 'value1', label: 'Temperature', color: '#FF0000' },
    { key: 'value2', label: 'Humidity', color: '#0000FF' },
    { key: 'value3', label: 'Brightness', color: '#FFFF00' },
];

    if (loading) {
        return <p>Loading...</p>;
    }
    else if(!room.fans){
        return <p>None</p>
    } 
    const data = [
        { name: '100', value1: room.temperature[0], value2: room.humidity[0], value3: room.brightness[0] },
        { name: '90', value1: room.temperature[1], value2: room.humidity[1], value3: room.brightness[1] },
        { name: '80', value1: room.temperature[2], value2: room.humidity[2], value3: room.brightness[2] },
        { name: '70', value1: room.temperature[3], value2: room.humidity[3], value3: room.brightness[3] },
        { name: '60', value1: room.temperature[4], value2: room.humidity[4], value3: room.brightness[4] },
        { name: '50', value1: room.temperature[5], value2: room.humidity[5], value3: room.brightness[5] },
        { name: '40', value1: room.temperature[6], value2: room.humidity[6], value3: room.brightness[6] },
        { name: '30', value1: room.temperature[7], value2: room.humidity[7], value3: room.brightness[7] },
        { name: '20', value1: room.temperature[8], value2: room.humidity[8], value3: room.brightness[8] },
        { name: '10', value1: room.temperature[9], value2: room.humidity[9], value3: room.brightness[9] }
        
    ];
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
                                        <h3>
                                            {roomname.toUpperCase()}
                                        </h3>
                                </div>
                            </div>
                            <div class = "row mt-4 pe-4">
                                <div class = "col-md-6">
                                    <img class="roomimg" src="https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2023/7/19/3/DOTY2023_Dramatic-Before-And-Afters_Hidden-Hills-11.jpg.rend.hgtvcom.616.411.suffix/1689786863909.jpeg" 
                                        alt="living" />
                                </div>
                                <div class="col-md-6 ">
                                    <div class="door mt-2 py-2 px-4">
                                        <h5>DOOR</h5>
                                        <div className = "form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                checked={room.door}
                                                onChange={handleSwitchChangeDoor}
                                            />
                                        </div>  
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7 py-2 ms-3 chart">
                            <Chart data={data} ynames={lines} domains={[-50, 300]} />
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
                                        <button class="btn btn-danger" onClick={() => autoMode( roomname, "fans", 0, lower_threshold_fan, 0, false)}>
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
                                        label = "°C"
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
                                        <button class="btn btn-danger" onClick={() => autoMode( roomname, "lights", 0, lower_threshold_light, 0, false)}>
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
                                        max={300}
                                        min={0}
                                        label = "%"
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
