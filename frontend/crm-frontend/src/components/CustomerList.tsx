import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { Customer, CustomerFilter } from '../types';
import { apiService } from '../services/api';
import CustomerForm from './CustomerForm';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [filter, setFilter] = useState<CustomerFilter>({});

  useEffect(() => {
    loadCustomers();
  }, []);

  const setErrorWithToast = (errorMessage: string) => {
    setError(errorMessage);
    setShowErrorToast(true);
    // 5 saniye sonra toast'ı kapat
    setTimeout(() => {
      setShowErrorToast(false);
      setError('');
    }, 5000);
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCustomers();
      setCustomers(data);
      setError('');
    } catch (err: any) {
      if (err.response?.data) {
        const errorMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.title || err.response.data.message || 'Error loading customers';
        setErrorWithToast(errorMessage);
      } else {
        setErrorWithToast('Error loading customers');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const data = await apiService.filterCustomers(filter);
      setCustomers(data);
      setError('');
    } catch (err: any) {
      if (err.response?.data) {
        const errorMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.title || err.response.data.message || 'Error during filtering';
        setErrorWithToast(errorMessage);
      } else {
        setErrorWithToast('Error during filtering');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setFilter({});
    loadCustomers();
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await apiService.deleteCustomer(id);
        setCustomers(customers.filter(c => c.id !== id));
      } catch (err: any) {
        if (err.response?.data) {
          const errorMessage = typeof err.response.data === 'string' 
            ? err.response.data 
            : err.response.data.title || err.response.data.message || 'Error deleting customer';
          setErrorWithToast(errorMessage);
        } else {
          setErrorWithToast('Error deleting customer');
        }
      }
    }
  };

  const handleFormSubmit = async (customer: Omit<Customer, 'id'> | Customer) => {
    try {
      if ('id' in customer) {
        await apiService.updateCustomer(customer);
        setCustomers(customers.map(c => c.id === customer.id ? customer : c));
      } else {
        const newCustomer = await apiService.createCustomer(customer);
        setCustomers([...customers, newCustomer]);
      }
      setShowForm(false);
      setEditingCustomer(null);
    } catch (err: any) {
      if (err.response?.data) {
        const errorMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.title || err.response.data.message || 'Error saving customer';
        setErrorWithToast(errorMessage);
      } else {
        setErrorWithToast('Error saving customer');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h4>Customer Management</h4>
        </Card.Header>
        <Card.Body>
          <Button 
            variant="primary" 
            onClick={() => setShowForm(true)}
            className="mb-3"
          >
            Add New Customer
          </Button>



          <Card className="mb-3">
            <Card.Header>Filtering</Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={filter.name || ''}
                      onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                      placeholder="Search by name..."
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={filter.email || ''}
                      onChange={(e) => setFilter({ ...filter, email: e.target.value })}
                      placeholder="Search by email..."
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Region</Form.Label>
                    <Form.Control
                      type="text"
                      value={filter.region || ''}
                      onChange={(e) => setFilter({ ...filter, region: e.target.value })}
                      placeholder="Search by region..."
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Registration Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={filter.registrationDate || ''}
                      onChange={(e) => setFilter({ ...filter, registrationDate: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Button variant="primary" onClick={handleFilter} className="me-2">
                    Filter
                  </Button>
                  <Button variant="secondary" onClick={handleClearFilter}>
                    Clear Filter
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Region</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.firstName}</td>
                  <td>{customer.lastName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.region}</td>
                  <td>{new Date(customer.registrationDate).toLocaleDateString('tr-TR')}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(customer)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Error Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showErrorToast} 
          onClose={() => setShowErrorToast(false)}
          delay={5000}
          autohide
          bg="danger"
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {error}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default CustomerList; 