import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <h1>This will be the landing page</h1>
      <Link to="/home" className="btn btn-success">
        Proceed to Dashboard
      </Link>
      <Link to="/signin" className="btn btn-info">
        Sign In
      </Link>
      <Link to="/signup" className="btn btn-info">
        Sign Up
      </Link>
    </div>
  );
};

export default LandingPage;
