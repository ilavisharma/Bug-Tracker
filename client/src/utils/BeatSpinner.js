import React from 'react';
import { BeatLoader } from 'react-spinners';
import Row from 'react-bootstrap/Row';

const BeatSpinner = () => {
  return (
    <Row className="justify-content-md-center">
      <BeatLoader size={20} color="#2B2B52" />
    </Row>
  );
};

export default BeatSpinner;
