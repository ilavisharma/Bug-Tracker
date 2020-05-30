import React from 'react';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

const TicketComments = () => {
  return (
    <Col xs={9}>
      <h4>Comments</h4>
      <ListGroup variant="flush">
        <ListGroup.Item>
          Cred synth photo booth, forage skateboard pok pok live-edge
          sustainable marfa
        </ListGroup.Item>
        <ListGroup.Item>
          Heirloom street art chia quinoa, copper mug viral wolf blue bottle
          occupy ugh polaroid keytar fingerstache lyft craft beer
        </ListGroup.Item>
        <ListGroup.Item>
          {' '}
          Master cleanse venmo cold-pressed, tumblr affogato quinoa vegan vinyl
          edison bulb selfies irony jianbing
        </ListGroup.Item>
        <ListGroup.Item>
          Ennui single-origin coffee lyft, cronut leggings chia blog
        </ListGroup.Item>
      </ListGroup>
    </Col>
  );
};

export default TicketComments;
