import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [hospitalsNearby, setHospitalsNearby] = useState('No');
  const [collegesNearby, setCollegesNearby] = useState('No');
  const [uploading, setUploading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(0);
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const ud = localStorage.getItem('UserDetail');
      const parse = JSON.parse(ud);
      const res = await axios.get(`https://presidio-backend-1.onrender.com/property/properties/${parse._id}`);
      const { message, data } = res.data;
      if (message === 'failed') {
        setFetchStatus(0);
      } else {
        setFetchStatus(1);
        setProperties(data);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const ud = localStorage.getItem('UserDetail');
    const parse = JSON.parse(ud);
    if (title === '' || place === '' || area === '' || bedrooms === '' || bathrooms === '' || hospitalsNearby === '' || collegesNearby === '') {
      toast.warn('All fields must be filled');
      setUploading(false);
      return;
    }
    try {
      if (isEditing && currentPropertyId) {
        // Update existing property
        const res = await axios.put(`https://presidio-backend-1.onrender.com/property/properties/${currentPropertyId}`, {
          title,
          place,
          area,
          bedrooms,
          bathrooms,
          hospitalsNearby,
          collegesNearby,
          sellerId: parse._id,
        });
        const { message } = res.data;
        if (message === 's') {
          resetForm();
          fetchProperties();
        }
      } else {
        // Create new property
        await axios.post('https://presidio-backend-1.onrender.com/property/properties', {
          title,
          place,
          area,
          bedrooms,
          bathrooms,
          hospitalsNearby,
          collegesNearby,
          sellerId: parse._id,
        });
      }
      setUploading(false);
      resetForm();
      fetchProperties();
    } catch (error) {
      console.error('Failed to submit property:', error);
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPlace('');
    setArea('');
    setBedrooms('');
    setBathrooms('');
    setHospitalsNearby('');
    setCollegesNearby('');
    setIsEditing(false);
    setCurrentPropertyId(null);
  };

  const handleEdit = (id) => {
    const property = properties.find((p) => p._id === id);
    setTitle(property.title);
    setPlace(property.place);
    setArea(property.area);
    setBedrooms(property.bedrooms);
    setBathrooms(property.bathrooms);
    setHospitalsNearby(property.hospitalsNearby);
    setCollegesNearby(property.collegesNearby);
    setIsEditing(true);
    setCurrentPropertyId(id);
  };

  const handleDelete = async (id) => {
    try {
      const ud = localStorage.getItem('UserDetail');
      const parse = JSON.parse(ud);
      const res = await axios.delete(`https://presidio-backend-1.onrender.com/property/properties/${id}/${parse._id}`);
      const { message } = res.data;
      if (message === 's') {
        fetchProperties();
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const interest = async (propertyId) => {
    const ud = localStorage.getItem('UserDetail');
    const parse = JSON.parse(ud);
    try {
      const res = await axios.post('https://presidio-backend-1.onrender.com/like/getlike', {
        sellerID: parse._id,
        propertyID: propertyId,
        
      });
      const { m, userdet } = res.data;
      if (m === 's') {
        setInterestedUsers(userdet);
        setShowInterestedModal(true);
      } else if (m === 'f') {
        toast.error('No interested users found.');
      }
    } catch (error) {
      console.error('Failed to fetch interested users:', error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div>
        <Form onSubmit={handleSubmit} className="mb-4">
          {/* Form Inputs */}
          <Row>
            <Col>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formPlace">
                <Form.Label>Place</Form.Label>
                <Form.Control
                  type="text"
                  name="place"
                  placeholder="Place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formArea">
                <Form.Label>Area</Form.Label>
                <Form.Control
                  type="text"
                  name="area"
                  placeholder="Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formBedrooms">
                <Form.Label>Bedrooms</Form.Label>
                <Form.Control
                  as="select"
                  name="bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formBathrooms">
                <Form.Label>Bathrooms</Form.Label>
                <Form.Control
                  as="select"
                  name="bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formHospitalsNearby">
                <Form.Label>Hospitals Nearby</Form.Label>
                <Form.Control
                  as="select"
                  name="hospitalsNearby"
                  value={hospitalsNearby}
                  onChange={(e) => setHospitalsNearby(e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formCollegesNearby">
                <Form.Label>Colleges Nearby</Form.Label>
                <Form.Control
                  as="select"
                  name="collegesNearby"
                  value={collegesNearby}
                  onChange={(e) => setCollegesNearby(e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" disabled={uploading}>
            {isEditing ? 'Update' : 'Submit'}
          </Button>
          {isEditing && <Button variant="secondary" onClick={resetForm} className="ml-2">Cancel</Button>}
        </Form>
        <Row>
          {fetchStatus === 0 ? (
            <p>No properties found.</p>
          ) : (
            properties.map((property) => (
              <Col key={property._id} md={4}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{property.title}</Card.Title>
                    <Card.Text>
                      <strong>Place:</strong> {property.place}<br />
                      <strong>Area:</strong> {property.area}<br />
                      <strong>Bedrooms:</strong> {property.bedrooms}<br />
                      <strong>Bathrooms:</strong> {property.bathrooms}<br />
                      <strong>Hospitals Nearby:</strong> {property.hospitalsNearby}<br />
                      <strong>Colleges Nearby:</strong> {property.collegesNearby}
                    </Card.Text>
                    <Button variant="warning" onClick={() => handleEdit(property._id)} className="mr-2">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(property._id)}>
                      <FaTrash />
                    </Button>
                    <Button variant="primary" onClick={() => interest(property._id)}>
                      Interested Peoples
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Modal for Interested Users */}
        <Modal show={showInterestedModal} onHide={() => setShowInterestedModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Interested Users</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {interestedUsers.length > 0 ? (
              <ul>
                {interestedUsers.map((user) => (
                  <li key={user._id}>
                    {user.firstname} {user.lastname} - {user.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No interested users found.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInterestedModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Home;
