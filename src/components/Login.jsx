/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle successful login
  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    navigate("/Home");
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://health-record-manager.onrender.com/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        handleLoginSuccess(data.token);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="bg-light p-4 rounded-lg">
            <h1 className="text-center mb-4">Login</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="showPasswordCheckbox">
                <Form.Check
                  className="mt-3"
                  type="checkbox"
                  label="Show Password"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                block="true"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>
            <p className="mt-3 text-center">
              Don't have an Account?{" "}
              <span
                onClick={() => navigate("/signup")}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                Signup
              </span>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

// Component that provides a welcome message and renders the Login component
export default function LoginPage() {
  return (
    <>
      <div className="text-center my-3">
        <h1>Welcome Back!</h1>
        <p>Please log in to continue.</p>
      </div>
      <Login />
    </>
  );
}
