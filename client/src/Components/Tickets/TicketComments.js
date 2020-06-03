import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import NewCommentModal from './NewCommentModal';
import useGet from '../../hooks/useGet';
import LoadingSpinner from '../../utils/LoadingSpinner';
import useAuthContext from '../../hooks/useAuthContext';
import { ConfirmAlert, SuccessAlert, ErrorAlert } from '../../alerts';
import api from '../../utils/api';

const TicketComments = ({ ticketId }) => {
  const [showNewComment, setShowNewComment] = useState(false);

  const { user } = useAuthContext();

  const { isLoading, refetch, response, error } = useGet(
    `/tickets/${ticketId}/comments`
  );

  const handleCommentDelete = async id => {
    const confirm = await ConfirmAlert('Delete this comment ?', 'Yeah');
    if (confirm.value) {
      api
        .delete(`/tickets/comments/${id}`, {
          headers: {
            authorization: localStorage.getItem('token')
          }
        })
        .then(res => {
          if (res.status === 200) SuccessAlert('Comment was deleted');
          else ErrorAlert(res.statusText);
          refetch();
        })
        .catch(err => {
          console.log(err);
          ErrorAlert(err.message);
        });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  else if (error) return <h6>{error}</h6>;
  else {
    const { data: comments } = response;
    return (
      <Col xs={10}>
        <Row>
          <Col xs={6}>
            <h3>
              <u>Comments</u>
            </h3>
          </Col>
          <Col xs={6}>
            <Button
              onClick={() => setShowNewComment(true)}
              className="float-right"
              variant="secondary"
            >
              + New
            </Button>
            <NewCommentModal
              refetch={refetch}
              show={showNewComment}
              handleClose={() => setShowNewComment(false)}
              ticketId={ticketId}
            />
          </Col>
        </Row>

        <ListGroup variant="flush">
          {comments.map(
            ({ content, photourl, id, name, dateadded, user_id }) => (
              <ListGroup.Item action={true} key={id}>
                <Row>
                  <Col xs={1}>
                    <Image
                      src={photourl}
                      height="50"
                      width="50"
                      roundedCircle
                    />
                  </Col>
                  <Col xs={10}>
                    {content}
                    <div className="text-muted">
                      {`${new Date(dateadded).toDateString()} at ${new Date(
                        dateadded
                      ).toLocaleTimeString()} by ${name}`}
                    </div>
                  </Col>
                  {user.id === user_id && (
                    <Col xs={1}>
                      <div className="float-right">
                        <i
                          onClick={() => handleCommentDelete(id)}
                          className="gg-trash"
                        ></i>
                      </div>
                    </Col>
                  )}
                </Row>
              </ListGroup.Item>
            )
          )}
        </ListGroup>
      </Col>
    );
  }
};

export default TicketComments;
