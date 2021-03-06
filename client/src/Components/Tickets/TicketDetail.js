import React, { useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ScreenshotModal from './ScreenshotModal';
import useGet from '../../hooks/useGet';
import useDelete from '../../hooks/useDelete';
import TicketTimelineModal from './TicketTimelineModal';
import useAuthContext from '../../hooks/useAuthContext';
import { ConfirmAlert, SuccessAlert, ErrorAlert } from '../../alerts';
import TicketComments from './TicketComments';
import usePut from '../../hooks/usePut';
import AssignDeveloperModal from './AssignDeveloperModal';

const ticketBadge = badge => {
  if (badge === 'error' || badge === 'high') return 'danger';
  if (badge === 'issue' || badge === 'medium') return 'warning';
  if (badge === 'bug' || badge === 'low') return 'info';
  if (badge === 'feature') return 'dark';
};

const TicketDetail = () => {
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const { user } = useAuthContext();
  const { push } = useHistory();
  const { id } = useParams();

  const { isLoading, response, error, refetch } = useGet(`/tickets/${id}`);
  const { delete: deleteTicket, isLoading: isDeleting } = useDelete(
    `/tickets/${id}`
  );

  const onDeleteClick = async name => {
    const result = await ConfirmAlert(`Delete the ticket: ${name} ?`, 'Yupp!');
    if (result.value) {
      deleteTicket().then(res => {
        if (res.status === 200) {
          SuccessAlert('Ticket Deleted');
          push('/home/tickets');
        } else {
          ErrorAlert('Unable to delete the ticket');
        }
      });
    }
  };

  const { isLoading: isChangingStatus, put } = usePut(
    `/tickets/${id}/changeStatus`
  );

  const handleTicketResolve = async value => {
    const result = await ConfirmAlert(
      `Mark this ticket as ${value ? 'resolved' : 'unresolved'} ?`,
      'Yes'
    );
    if (result.value) {
      put({ status: value })
        .then(res => {
          if (res.status === 200) {
            SuccessAlert('Ticket Status updated');
            refetch();
          }
        })
        .catch(err => {
          ErrorAlert(err);
          console.log(err);
        });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  else if (error)
    return (
      <h4 className="display-4">
        <Helmet>
          <title>Error fetching</title>
        </Helmet>
        There was some error
      </h4>
    );
  else {
    const { data: ticket } = response;
    return (
      <Col xs={11}>
        <Helmet>
          <title>{ticket.name}</title>
        </Helmet>
        <div className="row">
          <Col xs={11}>
            <h4 className="display-4">{ticket.name}</h4>
          </Col>
          <Col xs={1}>
            <h2>
              {ticket.resolved ? (
                <Badge variant="success">Resolved</Badge>
              ) : (
                <Badge variant="warning">Unresolved</Badge>
              )}
            </h2>
          </Col>
        </div>
        <p className="lead">
          <Badge
            className="float-right"
            pill={true}
            variant={ticketBadge(ticket.priority)}
          >
            {ticket.priority}
          </Badge>
          <Badge
            className="float-right"
            pill={true}
            variant={ticketBadge(ticket.type)}
          >
            {ticket.type}
          </Badge>
          <mark>
            <Link to={`/home/projects/${ticket.project_id}`}>
              {ticket.projectName}
            </Link>
          </mark>{' '}
          | {new Date(ticket.dateadded).toDateString()} by{' '}
          <b>{ticket.creator}</b>{' '}
          {ticket.developer !== null &&
            ` | Assigned to ${ticket.developer.name}`}
        </p>
        <hr />
        <p dangerouslySetInnerHTML={{ __html: ticket.description }}></p>
        <hr />
        <Row>
          <Col xs={9}>
            {ticket.imageurl !== null && (
              <Button
                className="mr-1"
                variant="secondary"
                onClick={() => setShowScreenshot(true)}
                style={{ display: 'inline-flex' }}
              >
                <i className="gg-laptop" style={{ margin: '2px 6px 0 0' }} />
                View Screenshot
              </Button>
            )}
            {(user.id === ticket.user_id ||
              user.role === 'manager' ||
              user.role === 'admin') && (
              <>
                {isDeleting ? (
                  <Button variant="danger" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Deleting...
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={() => onDeleteClick(ticket.name)}
                    style={{ display: 'inline-flex' }}
                  >
                    <i
                      style={{ margin: '10% 10px 0 0' }}
                      className="gg-trash-empty"
                    />
                    Delete
                  </Button>
                )}
                <Link
                  className="btn btn-info mx-2"
                  to={`/home/tickets/${id}/edit`}
                  style={{ display: 'inline-flex' }}
                >
                  <i className="gg-pen" style={{ margin: '8px 7px 0 0' }} />
                  Edit this ticket
                </Link>

                <Button
                  className="mx-3"
                  variant="light"
                  style={{ display: 'inline-flex' }}
                  onClick={() => setShowAssignModal(true)}
                >
                  <i style={{ marginRight: '4px' }} className="gg-user-add" />
                  Assign Developer
                </Button>
                <AssignDeveloperModal
                  show={showAssignModal}
                  handleClose={() => setShowAssignModal(false)}
                  projectId={ticket.project_id}
                  refetch={refetch}
                  ticketId={id}
                />
              </>
            )}
            {isChangingStatus ? (
              <Button>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Updating...
              </Button>
            ) : (
              <>
                {ticket.resolved ? (
                  <Button
                    onClick={() => handleTicketResolve(!ticket.resolved)}
                    style={{ display: 'inline-flex' }}
                    variant="warning"
                  >
                    <i className="gg-info" style={{ margin: '2px 6px 0 0' }} />
                    Mark as Unresolved
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleTicketResolve(!ticket.resolved)}
                    style={{ display: 'inline-flex' }}
                    variant="success"
                  >
                    <i className="gg-check" />
                    Mark as Resolved
                  </Button>
                )}
              </>
            )}
          </Col>
          <Col xs={3}>
            <Button
              onClick={() => setShowTimelineModal(true)}
              style={{ display: 'inline-flex' }}
            >
              <i style={{ margin: '2px 10px 0 0' }} className="gg-time" />
              View Ticket Timeline
            </Button>
          </Col>
        </Row>
        <ScreenshotModal
          show={showScreenshot}
          url={ticket.imageurl}
          handleClose={() => setShowScreenshot(false)}
        />
        <TicketTimelineModal
          ticketId={id}
          show={showTimelineModal}
          closeModal={() => setShowTimelineModal(false)}
        />
        <hr />
        <TicketComments ticketId={id} />
      </Col>
    );
  }
};

export default TicketDetail;
