import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import api from '../../utils/api';

const NewTicket = () => {
  const [projectList, setProjectList] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get('/projects');
        setProjectList(res.data);
        setProjectsLoaded(true);
      } catch (err) {
        console.log(err);
        alert(err);
        setProjectsLoaded(false);
      }
    })();
  }, []);

  return (
    <Col xs={9}>
      <h3 className="display-3">New Ticket</h3>
      <hr />

      <Form>
        <Form.Group>
          <Form.Label>Select the project</Form.Label>
          {!projectsLoaded ? (
            <Form.Control as="select" disabled>
              <option>Loading Projects</option>
            </Form.Control>
          ) : (
            <Form.Control as="select">
              {projectList.map(({ id, name }) => (
                <option value={id} key={id}>
                  {name}
                </option>
              ))}
            </Form.Control>
          )}
        </Form.Group>
      </Form>
    </Col>
  );
};

export default NewTicket;
