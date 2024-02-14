import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
import CustomNavbar from "./Navbar";

function EditHealthRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: "",
    exercise: "",
    notes: "",
  });

  useEffect(() => {
    async function fetchHealthRecord() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Handle missing token
          return;
        }

        const response = await fetch(`http://localhost:3000/health/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
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
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/health/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
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
