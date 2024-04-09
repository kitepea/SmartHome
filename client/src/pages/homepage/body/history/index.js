import { useEffect, useState } from "react";

const History = () => {
  const username = localStorage.getItem("username");
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      return JSON.parse(savedHistory);
    } else {
      return [];
    }
  });

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const [room, device] = data.feedName.split("-");
      const roomName = room === "living" ? "Living Room" : room;
      const deviceName =
        device === "fans" ? "Fan" : "lights" ? "Light" : device;
      const config = data.value === "1" ? "On" : "Off";
      const configDate = new Date().toLocaleString("vi-VN");
      const newEvent = { roomName, deviceName, config, configDate };
      setHistory((prevHistory) => {
        const updatedHistory = [newEvent, ...prevHistory];
        localStorage.setItem("history", JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Room</th>
            <th scope="col">Username</th>
            <th scope="col">Device Name</th>
            <th scope="col">Config</th>
            <th scope="col">Config Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map((event, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{event.roomName}</td>
              <td>{username}</td>
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

export default History;
