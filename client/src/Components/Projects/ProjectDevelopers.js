import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import AssignDevelopersModal from './AssignDevelopersModal';
import LoadingSpinner from '../../utils/LoadingSpinner';
import api from '../../utils/api';

const ProjectDevelopers = () => {
  const [developers, setDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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
      <h5>These are assigned</h5>
      <Button onClick={() => setShowAddModal(true)}>+ Add</Button>
      <AssignDevelopersModal
        show={showAddModal}
        close={() => setShowAddModal(false)}
        project_id={project_id}
        refetch={fetchDevelopers}
      />
      {developers.map(d => (
        <li key={d.user_id}>{d.name}</li>
      ))}
    </Container>
  );
};

export default ProjectDevelopers;
