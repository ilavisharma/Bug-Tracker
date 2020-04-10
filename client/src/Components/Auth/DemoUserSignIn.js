import React from 'react';
import Button from 'react-bootstrap/Button';

const DemoUserSignIn = () => {
  return (
    <div>
      <h4 className="display-4">
        <i>Demo Users will sign in from here</i>
      </h4>
      <Button variant="danger">Admin</Button>
      <Button variant="success">Project Manager</Button>
      <Button variant="warning">Developer</Button>
      <Button variant="primary">Submitter</Button>
    </div>
  );
};

export default DemoUserSignIn;
