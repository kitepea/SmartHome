import {memo, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';

const Room = () =>{
    const { roomname } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const ToggleDivice = async (roomname, type, index) => {
        try {
            const response = await fetch("http://localhost:5000/toggle", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomname, type, index })
            });
    
            const data = await response.json();
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

        return () => clearInterval(intervalId);
    }, [roomname]);

    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <h1>Room</h1>
            <h2> Name: {room.roomname} </h2>
            <h2> Temperature: {room.temperature} </h2>
            <h2> Brightness: {room.brightness} </h2>
            <h2> Humidity: {room.humidity} </h2>
            <h2> Fans: </h2>
            <ul>
                {room.fans ? (
                    room.fans.map((fan, index) => (
                        <li key={index}>
                            <h3>{fan.name}</h3>
                            <button onClick={() => ToggleDivice(roomname, "fans", index)}>
                                {fan.state ? "ON" : "OFF"}
                            </button>
                        </li>
                    ))
                ) : (
                    <li>None    </li>
                )}
            </ul>

            <h2> Lights: </h2>
            <ul>
                {room.lights.map((light, index) => (
                    <li key = {index}>
                        <h3>{light.name}</h3>
                        <button onClick={() => ToggleDivice(roomname, "lights", index)}>
                            {light.state? "ON" : "OFF"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}   
export default memo(Room);
