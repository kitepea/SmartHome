import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";

const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [loading, setLoading] = useState(true);
  const [logininfo, setlogininfo] = useState();

  function RoomButton({ room, imageSrc, name }) {
    return (
      <div className="room d-flex flex-column align-items-center py-3">
        <img
          src={imageSrc}
          alt={`${room} image`}
          className="mb-3"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "20px",
          }}
        />
        <button
          onClick={() => handleRoom(room)}
          type="submit"
          className="btn text-bg-dark"
          style={{
            width: "140px",
          }}
        >
          {name}
        </button>
      </div>
    );
  }

  useEffect(() => {
    const fetchLogininfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/logininfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        });
        const data = await response.json();
        const logininfo = data.logininfo;
        setlogininfo(logininfo);
        setLoading(false);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchLogininfo();

    const intervalId = setInterval(fetchLogininfo, 30000);
    // Note
    return () => clearInterval(intervalId);
  }, [username]);
  const handleLogin = () => {
    navigate("/login");
  };

  const handleRoom = (roomname) => {
    navigate(`/${roomname}`);
  };

  if (username)
    return (
      <div className="container py-3">
        <div className="row">
          <div
            className="col-lg-2 d-flex flex-column p-0 overflow-auto"
            style={{
              backgroundColor: "#EBEAFC",
              borderRadius: "24px",
              height: "100vh",
            }}
          >
            <div
              className="fw-semibold fs-2 text-center w-100 sticky-top lh-sm"
              style={{
                backgroundColor: "#93A7D0",
                borderRadius: "24px",
              }}
            >
              Choose <br /> a room
            </div>
            <RoomButton
              room="living"
              imageSrc="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWgel"
              name="Living room"
            />
            <RoomButton
              room="bed"
              imageSrc="https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              name="Bedroom"
            />
            <RoomButton
              room="kitchen"
              imageSrc="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              name="Kitchen"
            />
            <RoomButton
              room="wc"
              imageSrc="https://images.unsplash.com/photo-1587527901949-ab0341697c1e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              name="WC"
            />
          </div>

          <div className="col-lg-10 d-flex flex-column">
            <div
              className="fw-semibold fs-2 text-center w-50 mx-auto"
              style={{
                backgroundColor: "#93A7D0",
                borderRadius: "24px",
              }}
            >
              Recent signing in
            </div>
            <div
              className="my-3"
              style={{ height: "100vh", overflow: "auto", width: "fit-parent" }}
            >
              {loading ? (
                <p>Loading</p>
              ) : (
                <table className="table table-striped table-hover table-bordered fs-4">
                  <thead
                    style={{
                      backgroundColor: "#0000FF !important",
                      color: "#FFFFFF !important",
                    }}
                  >
                    <tr>
                      <th scope="col">User</th>
                      <th scope="col">Time</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logininfo
                      .sort(
                        (a, b) =>
                          new Date(b.record_time) - new Date(a.record_time)
                      )
                      .map((info, index) => {
                        const date = new Date(info.record_time);
                        const time = date.toLocaleTimeString();
                        const dateString = date.toLocaleDateString();

                        return (
                          <tr key={index}>
                            <td className="user-col">{info.username}</td>
                            <td className="time-col">{time}</td>
                            <td className="date-col">{dateString}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div>
      <p>Bạn cần phải đăng nhập</p>
      <button onClick={handleLogin} type="submit">
        Đăng nhập
      </button>
    </div>
  );
};
export default memo(Home);
