import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
import CustomNavbar from "./Navbar";

function EditHealthRecord() {
  const { id } = useParams(); // Get the id parameter from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    weight: "",
    exercise: "",
    notes: "",
  });

  // Fetch the health record data when the component mounts
  useEffect(() => {
    async function fetchHealthRecord() {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        if (!token) {
          // Handle missing token
          return;
        }

        // Fetch the health record data using the id and token
        const response = await fetch(
          `https://health-record-manager.onrender.com/health/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          // If the response is successful, set the form data with the fetched data
          const data = await response.json();
          setFormData({
            weight: data.weight,
            exercise: data.exercise,
            notes: data.notes,
          });
        } else {
          console.error("Failed to fetch health record");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchHealthRecord();
  }, [id]); // Run this effect whenever the id changes

  // Function to handle changes in the form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await fetch(
        `https://health-record-manager.onrender.com/health/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData), // Send the updated data in the request body
        }
      );
      if (response.ok) {
        console.log("Health record updated successfully");
        navigate("/Home"); // Redirect to health record list page
      } else {
        console.error("Failed to update health record");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container className="edit-container">
        <div className="edit-health-record-container">
          <h1>Edit Health Record</h1>
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
              Update
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default EditHealthRecord;
