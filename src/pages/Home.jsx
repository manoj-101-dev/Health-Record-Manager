import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomNavbar from "../components/Navbar";
import "../App.css";

function Home() {
  return (
    <div className="nav-with-margin">
      {/* Render the custom navbar */}
      <CustomNavbar />

      {/* Main content container */}
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="text-center mb-4">Welcome to Health Tracker App</h2>
            <p className="text-center">
              Monitor your health effortlessly with our intuitive tracking
              system.
            </p>
          </Col>
        </Row>

        {/* View all records button */}
        <div className="view-btn">
          <Link to="/list">
            <Button variant="primary">View All Records</Button>
          </Link>
        </div>
      </Container>

      {/* Create new record button */}
      <div className="create-btn">
        <Link to="/create">
          <Button variant="primary">Create New Record</Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
