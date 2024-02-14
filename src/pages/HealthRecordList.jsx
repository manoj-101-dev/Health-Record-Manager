// HealthRecordList component

import { Alert, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomNavbar from "../components/Navbar";

function HealthRecordList() {
  const navigate = useNavigate();
  const [healthRecords, setHealthRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    // Fetch token from local storage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found in local storage");
      setLoading(false);
      return;
    }

    const fetchHealthRecords = async () => {
      try {
        const response = await fetch("http://localhost:3000/health/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch health records");
        }
        const data = await response.json();
        setHealthRecords(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, []);

  const handleEdit = (recordId) => {
    // Navigate to edit page with the record ID as a URL parameter
    navigate(`/edit/${recordId}`);
  };

  const handleDelete = (recordId) => {
    setRecordToDelete(recordId); // Set the record ID to be deleted
    setShowDeleteConfirmation(true); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/health/delete/${recordToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        // Handle success, maybe show a success message
        console.log("Health record deleted successfully");
        // Update the health records list after deletion
        setHealthRecords(
          healthRecords.filter((record) => record._id !== recordToDelete)
        );
      } else {
        // Handle error, maybe show an error message
        console.error("Failed to delete health record");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setShowDeleteConfirmation(false); // Close the confirmation modal
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Close the confirmation modal
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-5">
        <h2 className="text-center ">Record List</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <p className="text-center"> Loading...</p>
        ) : (
          <ul className="list-unstyled">
            {healthRecords.map((record) => (
              <li key={record._id} className="health-record-card mb-3">
                <div className="health-record-header">
                  <h3>Health Record</h3>
                </div>
                <div className="health-record-content">
                  <Row>
                    <Col>
                      <strong>Weight:</strong> {record.weight} kg
                    </Col>
                    <Col>
                      <strong>Exercise:</strong> {record.exercise}
                    </Col>
                    <Col>
                      <strong>Notes:</strong> {record.notes}
                    </Col>
                  </Row>
                </div>
                <div className="health-record-actions">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleEdit(record._id)}
                  >
                    <FaEdit /> Edit
                  </Button>{" "}
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(record._id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteConfirmation} onHide={cancelDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this health record?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default HealthRecordList;
