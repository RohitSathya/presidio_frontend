import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
export default function homebuyer() {
    const [properties, setProperties] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(0);
    useEffect(() => {
        async function fetchpro(){
            try {
            
                const res = await axios.get('https://presidio-backend-1.onrender.com/property/sellerproperties');
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

        }
        fetchpro()
       
      }, []);

      useEffect(()=>{

      })
    
      async function like(e,s){
        const ud=localStorage.getItem('UserDetail')
        const parse=JSON.parse(ud)
         const res=await axios.post('https://presidio-backend-1.onrender.com/like/addlike',{buyerID:parse._id,sellerID:s,propertyID:e,email:parse.email})
         const {message}=res.data
         if(message=='f'){
          toast.warn('Already Liked')
         }
         else if(message=='s'){
          const res2 = await axios.get('https://presidio-backend-1.onrender.com/property/sellerproperties');
          const { message, data } = res2.data;
          if (message === 'failed') {
            setFetchStatus(0);
          } else {
            setFetchStatus(1);
            setProperties(data);
          }

         }
         
               
      }
  return (
   <>
   <ToastContainer/>
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
                    <strong>Colleges Nearby:</strong> {property.collegesNearby}<br/>
                    <strong>Likes:</strong> {property.lc}
                  </Card.Text>
                 <Button onClick={()=>like(property._id,property.sellerId)}>Like Property</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
   </>
  )
}
