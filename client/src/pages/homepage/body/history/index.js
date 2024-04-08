import { memo } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useState, useEffect } from "react";

const Card = () => {
  const cardStyle = {
    width: "10rem",
  };

  const imgStyle = {
    width: "100%",
    height: "5rem",
    objectFit: "cover",
  };

  return (
    <div class="card" style={cardStyle}>
      <img
        style={imgStyle}
        src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Mzc0NDd8MHwxfHNlYXJjaHwyfHxsaXZpbmclMjByb29tfGVufDB8fHx8MTcxMjU4MTc0MHww&ixlib=rb-4.0.3&q=85&q=85&fmt=jpg&crop=entropy&cs=tinysrgb&w=450"
        class="card-img-top"
        alt="Room Image"
      />
    </div>
  );
};

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://localhost:5001");

    ws.onopen = () => {
      console.log("Connected to server");
    };

    ws.onmessage = (message) => {
      const event = JSON.parse(message.data);
      setHistory((prevHistory) => [event, ...prevHistory]);
    };

    return () => {
      ws.close();
    };
  }, []);
  return (
    <div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Username</th>
            <th scope="col">Room</th>
            <th scope="col">Device Name</th>
            <th scope="col">Config</th>
            <th scope="col">Config Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map((event, index) => (
            <tr key={index}>
              <td>
                <Card />
              </td>
              <td>{event.username}</td>
              <td>{event.room}</td>
              <td>{event.deviceName}</td>
              <td>{event.config}</td>
              <td>{event.configDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(History);
