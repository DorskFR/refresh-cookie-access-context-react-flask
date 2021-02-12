import React from 'react';
import { useUserContext } from './UserContext';
import { Container, Jumbotron, Col } from 'react-bootstrap';

export const Landing = () => {
  const { user } = useUserContext();
  return (
    <>
      <Container>
        <Jumbotron>
          <Col sm={8} className="mx-auto">
            <h1 className="text-center">Welcome {user ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : null}</h1>
          </Col>
        </Jumbotron>
      </Container>
    </>
  );
};