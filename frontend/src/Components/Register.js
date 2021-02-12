import React, { useState } from 'react';
import { register } from './Api';
import {
  Form, Container, Button, Col,
  Row, Jumbotron
} from 'react-bootstrap';
import toast from 'react-hot-toast';

export const Register = () => {

  const blankUser = {
    username: '',
    email: '',
    role: 'user',
    password: ''
  }

  const [newUser, setNewUser] = useState(blankUser);

  const handleChange = event => {
    event.persist();
    setNewUser(prevUser => ({ ...prevUser, [event.target.id]: event.target.value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    register(newUser)
      .then(response => {
        if (response.status === 201) {
          toast.success(`User created successfully.`);
          setNewUser(blankUser);
        }
        else if (response.status === 500) {
          toast.error(`Error ${response.status}: Server unavailable.`);
        }
        else {
          toast.error(`Error ${response.status}: ${response.data.error}`);
        }
      })
      .catch(error => {
        toast.error(`Error: ${error}`);
      });
  };


  return (
    <Container>
      <Jumbotron>
        <Row>
          <Col md={6} mt={5} className="mx-auto">
            <h3 className="h3 mb-3 font-weight-normal">Register</h3>
            <br />
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Row>
                  <Col>
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control
                      type="text" required
                      id="username"
                      placeholder="Enter username"
                      value={newUser.username}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col>
                    <Form.Label htmlFor="role">Permission level</Form.Label>
                    <Form.Control as="select"
                      id="role"
                      value={newUser.role}
                      onChange={handleChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.Control
                  type="email" required
                  id="email"
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  type="password" required
                  id="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <br />
                {newUser.role === 'admin' && (
                  <Button
                    variant="danger"
                    type="submit"
                    className="btn btn-lg btn-primary btn-block"
                  >
                    Register
                  </Button>)}
                {newUser.role === 'user' && (
                  <Button
                    type="submit"
                    className="btn btn-lg btn-primary btn-block"
                  >
                    Register
                  </Button>
                )}
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Jumbotron>
    </Container>
  );
};