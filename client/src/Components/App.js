import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavigationBar from './NavigationBar/NavigationBar';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <NavigationBar />
        <Switch>
          <Route
            path="/"
            component={() => <Container>Bug bug bug</Container>}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
