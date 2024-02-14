import { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";
import CustomNavbar from "./Navbar";

function CreateHealthRecord() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: "",
    exercise: "",
    notes: "",
  });
  const [error, setError] = useState("");

  // Function to handle changes in the form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;

    // Validation: check if weight is a number
    if (!formData.weight || isNaN(formData.weight)) {
      setError("Weight must be a number");
      formIsValid = false;
    }
    // Validation: check if exercise is not empty
    else if (!formData.exercise.trim()) {
      setError("Exercise is required");
      formIsValid = false;
    }
    // Validation: check if notes are not empty
    else if (!formData.notes.trim()) {
      setError("Notes are required");
      formIsValid = false;
    }

    // If form is valid, submit the data
    if (formIsValid) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://health-record-manager.onrender.com/health/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          console.log("Health record created successfully");
          navigate("/Home"); // Redirect to health record list page
        } else {
          console.error("Failed to create health record");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container className="edit-container">
        <div className="edit-health-record-container">
          <h1>Create a New Health Record</h1>
          <p>Fill in the details below to create a new health record:</p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="weight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="exercise">
              <Form.Label>Exercise</Form.Label>
              <Form.Control
                type="text"
                name="exercise"
                value={formData.exercise}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Record
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default CreateHealthRecord;
