import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useUserContext } from './UserContext';
import { login } from './Api';
import { Container, Form, Button, Row, Col, Jumbotron } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';

export const Login = () => {

  const history = useHistory();
  const { user, setUser } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginUser = {
      email: email,
      password: password
    };

    login(loginUser)
      .then(response => {
        if (response.status === 200) {
          const decoded = jwt_decode(response.data['access_token']);
          setUser({
            username: decoded.identity.username,
            role: decoded.identity.role,
            email: decoded.identity.email
          });
          toast.success(`You logged in!`);
          history.push(`/profile`);
        }
        else if (response.status === 500) {
          // Server unavailable.
          toast.error(`Error ${response.status}: Server unavailable.`);
        }
        else {
          // Other error.
          toast.error(`Error ${response.status}: ${response.data.error}`);
        }
      })
      .catch(error => {
        // Errors.
        toast.error(`Error: ${error}`);
      });
  };

  // if already logged in, redirect to another page.
  if (user) {
    return <Redirect to="/profile" />;
  };

  return (
    <Container>
      <Jumbotron>
        <Row>
          <Col md={5} mt={5} className="mx-auto">
            <Form onSubmit={event => { handleSubmit(event) }}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
              <br />
              <Form.Group className="form-group">
                <Form.Label htmlFor="email">Email address</Form.Label>
                <Form.Control
                  type="email" required
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  type="password" required
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                />
              </Form.Group>
              <Button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Sign in
              </Button>
            </Form>
          </Col>
        </Row>
      </Jumbotron>
    </Container>
  );
}