import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import AssignDevelopersModal from './AssignDevelopersModal';
import LoadingSpinner from '../../utils/LoadingSpinner';
import api from '../../utils/api';
import usePut from '../../hooks/usePut';
import { ErrorAlert, SuccessAlert, ConfirmAlert } from '../../alerts';

const ProjectDevelopers = () => {
  const [developers, setDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selected, setSelected] = useState([]);

  const { id: project_id } = useParams();

  const fetchDevelopers = useCallback(async () => {
    try {
      const res = await api.get(`/projects/${project_id}/developers`);
      if (res.status === 200) {
        setDevelopers(res.data);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }, [project_id]);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  const handleSelect = id => {
    if (!selected.includes(id)) setSelected([...selected, id]);
    else setSelected(selected.filter(i => i !== id));
  };

  const { put, isLoading: isRemoving } = usePut(
    `/projects/${project_id}/removeDevelopers`
  );

  const handleRemove = async () => {
    const result = await ConfirmAlert(
      `Remove ${selected.length} developer${
        selected.length !== 1 ? 's' : ''
      } ?`,
      'Yes'
    );
    if (!result.value) return;
    put(selected)
      .then(res => {
        if (res.status === 200) {
          SuccessAlert('Removed Succesfully');
          setSelected([]);
          fetchDevelopers();
        }
      })
      .catch(err => {
        console.log(err);
        ErrorAlert('Unable to remove!');
      });
  };

  if (isLoading)
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  if (error)
    return (
      <Container>
        <h4>There was some error</h4>
      </Container>
    );

  return (
    <Container>
      <h5>Developers assigned to this project</h5>
      <Button onClick={() => setShowAddModal(true)}>+ Add</Button>
      <AssignDevelopersModal
        show={showAddModal}
        close={() => setShowAddModal(false)}
        project_id={project_id}
        refetch={fetchDevelopers}
      />
      {selected.length !== 0 && (
        <>
          {isRemoving ? (
            <Button className="mx-3" variant="danger">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Removing
            </Button>
          ) : (
            <Button
              onClick={handleRemove}
              disabled={selected.length === 0}
              className="mx-3"
              variant="danger"
            >
              Remove
            </Button>
          )}
        </>
      )}
      <hr />
      <div className="d-flex flex-wrap">
        {developers.map(({ photourl, name, user_id }) => (
          <span
            onClick={() => handleSelect(user_id)}
            key={user_id}
            className={`border border-secondary rounded developer-card mx-3 mb-3 ${
              selected.includes(user_id) ? 'bg-dark' : ''
            }`}
          >
            <Image src={photourl} roundedCircle className="avatar mr-2" />
            {name}
          </span>
        ))}
      </div>
    </Container>
  );
};

export default ProjectDevelopers;
