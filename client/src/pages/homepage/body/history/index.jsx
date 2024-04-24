import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";

const History = () => {
  const username = localStorage.getItem("username");
  const [history, setHistory] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData  = async () =>  {
      try {
        const response = await fetch("http://localhost:5000/history-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        });
        const data = await response.json();
        const historyData = data.historyInfo;
        console.log(historyData);
        setHistory(historyData);
        setLoading(false);
      } catch (error) {
        alert(error.message);
      }
    }
    setData()
    
  }, [username]);

  if (loading) {
      return <p>Loading...</p>;
  } else return (
    <div className="d-flex flex-column h-100 container-fluid" style={{ minHeight: "100vh" }}>
      <div class="table-responsive text-center mb-auto">
        <h1>Device history</h1>
        <table class="table table-striped table-hover mt-4">
          <thead>
            <tr className="table-success">
              <th scope="col">#</th>
              <th scope="col">Room</th>
              <th scope="col">Username</th>
              <th scope="col">Device Name</th>
              <th scope="col">Config</th>
              <th scope="col">Config Date</th>
            </tr>
          </thead>
          <tbody>
          {history.slice().reverse().map((item, index) => (
              <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.romname}</td>
                  <td>{item.username}</td>
                  <td>{item.devicename}</td>
                  <td>{item.config}</td>
                  <td>{item.time}</td>
              </tr>
          ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
