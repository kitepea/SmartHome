import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Room = () => {
  const { roomname } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeOn, settimeOn] = useState("");
  const [timeOff, settimeOff] = useState("");

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

  const scheMode = async (roomname, type, index, timeOn, timeOff, state) => {
    const timeOnString = timeOn.toString();
    const timeOffString = timeOff.toString();
    try {
      const response = await fetch("http://localhost:5000/sendtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomname,
          type,
          index,
          timeOn: timeOnString,
          timeOff: timeOffString,
          state,
        }),
      });
      console.log(response);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch("http://localhost:5000/room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomname }),
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
              <div>
                <h3>{fan.name}</h3>
                <button
                  onClick={() => Publish(roomname, "fans", index, !fan.state)}
                >
                  {fan.state ? "ON" : "OFF"}
                </button>
              </div>

              <div>
                <h3>Schedule mode</h3>
                <input
                  type="time"
                  onChange={(e) => settimeOn(e.target.value)}
                  required
                />
                <input
                  type="time"
                  onChange={(e) => settimeOff(e.target.value)}
                  required
                />
                <button
                  onClick={() => {
                    if (!timeOn || !timeOff) {
                      alert("Vui lòng chọn thời gian");
                    } else {
                      scheMode(roomname, "fans", index, timeOn, timeOff, true);
                    }
                  }}
                >
                  Set
                </button>
                {fan.sche_mode ? (
                  <div>
                    <p>
                      {fan.ontime}-{fan.offtime}
                    </p>
                    <button
                      onClick={() =>
                        scheMode(
                          roomname,
                          "fans",
                          index,
                          timeOn,
                          timeOff,
                          false
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <p>Schedule mode is off</p>
                )}
              </div>
            </li>
          ))
        ) : (
          <li>None</li>
        )}
      </ul>

      <h2> Lights: </h2>
      <ul>
        {room.lights.map((light, index) => (
          <li key={index}>
            <div>
              <h3>{light.name}</h3>
              <button
                onClick={() => Publish(roomname, "lights", index, !light.state)}
              >
                {light.state ? "ON" : "OFF"}
              </button>
            </div>
            <div>
              <h3>Schedule mode</h3>
              <input
                type="time"
                onChange={(e) => settimeOn(e.target.value)}
                required
              />
              <input
                type="time"
                onChange={(e) => settimeOff(e.target.value)}
                required
              />
              <button
                onClick={() => {
                  if (!timeOn || !timeOff) {
                    alert("Vui lòng chọn thời gian");
                  } else {
                    scheMode(roomname, "lights", index, timeOn, timeOff, true);
                  }
                }}
              >
                Set
              </button>
              {light.sche_mode ? (
                <div>
                  <p>
                    {light.ontime}-{light.offtime}
                  </p>
                  <button
                    onClick={() =>
                      scheMode(
                        roomname,
                        "lights",
                        index,
                        timeOn,
                        timeOff,
                        false
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <p>Schedule mode is off</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default memo(Room);
