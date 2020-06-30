import React from 'react';
import { Helmet } from 'react-helmet';

const Head = () => {
  return (
    <Helmet>
      <title>Dashboard</title>
      <meta name="title" content="Dashboard" />
      <meta name="description" content="Bug Tracker App dashboard" />
    </Helmet>
  );
};

export default Head;
