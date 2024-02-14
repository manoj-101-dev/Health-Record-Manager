/* eslint-disable react/no-unescaped-entities */
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

function NotFound() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center">
            <h1>404 - Not Found</h1>
            <p>The page you're looking for does not exist.</p>
            <div className="go-btn">
              <Link to="/">
                <Button variant="primary">Go Back</Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
