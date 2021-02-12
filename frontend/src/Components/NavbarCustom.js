import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useUserContext } from './UserContext';
import { Navbar, Nav } from 'react-bootstrap';
import { logout } from './Api';
import toast from 'react-hot-toast';

export const NavbarCustom = () => {

  const history = useHistory();
  const location = useLocation();
  const { user, setUser } = useUserContext();
  const [expanded, setExpanded] = useState(false);

  const logOut = (event) => {
    event.preventDefault();
    logout()
      .then(() => {
        toast.success(`Logged out.`);
        setUser(null);
        history.push(`/`);
      })
      .catch(e => { });
  };

  const userLoggedIn = (
    <>
      <Nav.Item>
        <Nav.Link
          to="/profile"
          as={Link}
          eventKey="/profile"
          onClick={() => setTimeout(() => { setExpanded(false) }, 150)}
        >
          Profile
        </Nav.Link>
      </Nav.Item>
    </>
  );

  const adminLoggedIn = (
    <>
      <Nav.Item>
        <Nav.Link
          to="/profile"
          as={Link}
          eventKey="/profile"
          onClick={() => setTimeout(() => { setExpanded(false) }, 150)}
        >
          Profile
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          to="/admin"
          as={Link}
          eventKey="/admin"
          onClick={() => setTimeout(() => { setExpanded(false) }, 150)}
        >
          Admin Only
        </Nav.Link>
      </Nav.Item>
    </>
  );

  const loggedOut = (
    <>
      <Nav.Item>
        <Nav.Link
          to="/login"
          as={Link}
          eventKey="/login"
          onClick={() => setTimeout(() => { setExpanded(false) }, 150)}
        >
          Login
      </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          to="/register"
          as={Link}
          eventKey="/register"
          onClick={() => setTimeout(() => { setExpanded(false) }, 150)}
        >
          Register
        </Nav.Link>
      </Nav.Item>
    </>
  );

  const loggedIn = (
    <Nav>
      <Nav.Item>
        <Nav.Link
          to=""
          as={Link}
          eventKey="/logout"
          onClick={event => { logOut(event) }}
        >
          Logout
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );

  return (
    <Navbar
      fixed="top"
      collapseOnSelect
      expanded={expanded}
      bg="dark"
      expand="md"
      variant="dark"
    >
      <Navbar.Toggle
        aria-controls="navbarsExample10"
        aria-label="Toggle navigation"
        onClick={() => setExpanded(expanded ? false : "expanded")}
      />
      <Navbar.Collapse className="justify-content-md-center" id="navbarsExample10">
        <Nav variant="pills" activeKey={location.pathname}>
          <Nav.Item>
            <Nav.Link
              to="/"
              as={Link}
              eventKey="/"
              onClick={() => setTimeout(() => { setExpanded(false) }, 150)}
            >
              Home
            </Nav.Link>
          </Nav.Item>
          {user?.role === 'admin' ? adminLoggedIn : null}
          {user?.role === 'user' ? userLoggedIn : null}
          {user ? loggedIn : loggedOut}
        </Nav>
      </Navbar.Collapse>
      <Nav.Item>
        <div className="vernum">v1.1.0</div>
      </Nav.Item>
    </Navbar >
  );
};