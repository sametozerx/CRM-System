import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import CustomerList from './CustomerList';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
                      <div className="d-flex justify-content-between align-items-center">
              <h1>CRM System Dashboard</h1>
              <div className="d-flex align-items-center">
                <span className="me-3">
                  Welcome, {user?.username} ({user?.role})
                </span>
                <Button variant="outline-danger" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <CustomerList />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 