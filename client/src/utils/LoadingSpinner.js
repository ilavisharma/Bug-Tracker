import React from 'react';
import { ClipLoader } from 'react-spinners';
import Row from 'react-bootstrap/Row';

const LoadingSpinner = () => (
  <Row className="justify-content-md-center">
    <ClipLoader size={100} color="#2B2B52" />
  </Row>
);

export default LoadingSpinner;
