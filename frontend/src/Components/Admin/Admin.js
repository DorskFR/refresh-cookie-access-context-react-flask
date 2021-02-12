import React from 'react';
import { Redirect } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import { Container, Jumbotron, Table, Col } from 'react-bootstrap';


export const Admin = () => {
  const { user } = useUserContext();

  if (!user || user?.role !== 'admin') {
    return <Redirect to="/login" />;
  };

  return (
    <>
      <Container>
        <Jumbotron>
          <Col sm={8} className="mx-auto">
            <h1 className="text-center">Admin only component</h1>
            <br />
          </Col>
          <Table className="col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>Username</td>
                <td>{user.username}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Role</td>
                <td>{user.role}</td>
              </tr>
            </tbody>
          </Table>
        </Jumbotron>
      </Container>
    </>
  );
};