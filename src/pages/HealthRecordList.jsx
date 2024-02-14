import { useState } from "react";
import { Alert, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CustomNavbar from "../components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";

function HealthRecordList() {
  const navigate = useNavigate();
  const [healthRecords, setHealthRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Fetch health records from the server
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found in local storage");
      setLoading(false);
      return;
    }

    const fetchHealthRecords = async () => {
      try {
        const response = await fetch(
          "https://health-record-manager.onrender.com/health/getAll",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  // Handle editing a health record
  const handleEdit = (recordId) => {
    navigate(`/edit/${recordId}`);
  };

  // Handle initiating record deletion
  const handleDelete = (recordId) => {
    setRecordToDelete(recordId);
    setShowDeleteConfirmation(true);
  };

  // Confirm deletion and update the list of health records
  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://health-record-manager.onrender.com/health/delete/${recordToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        console.log("Health record deleted successfully");
        setHealthRecords(
          healthRecords.filter((record) => record._id !== recordToDelete)
        );
      } else {
        console.error("Failed to delete health record");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
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
