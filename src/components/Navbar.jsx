/* eslint-disable no-unused-vars */
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import man from "../assets/man.png";
import shape from "../assets/shape.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CustomNavbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/users/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email);
        setUserName(data.name || "Guest");
      } else {
        setError("Failed to fetch user data");
      }
    } catch (error) {
      setError("Error fetching user data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      setError("Error logging out: " + error.message);
    }
  };

  return (
    <Navbar>
      <Navbar.Brand>
        {<img src={shape} alt="logo" className="logo" />}
      </Navbar.Brand>
      <Navbar.Brand href="#home" className="m-3">
        Health Tracker
      </Navbar.Brand>

      <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
      <Nav className="mr-auto">
        <div className="d-flex align-items-center">
          <h4 className="mr-3">{userName}</h4>
          <div className="position-relative">
            <NavDropdown
              id="basic-nav-dropdown"
              title={<img src={man} alt="profile" className="avatar" />}
            >
              <NavDropdown.Item>{userEmail}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
            <style>
              {`
                .dropdown-menu {
                  text-align: center;
                  transform: translateX(calc(-70%));
                  min-width: 220px; 
                  max-width: 280px; 
                  overflow: hidden; 
                  white-space: nowrap; 
                }
              `}
            </style>
          </div>
        </div>
      </Nav>
    </Navbar>
  );
}

export default CustomNavbar;
