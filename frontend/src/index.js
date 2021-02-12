// React stuff
import './index.css';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom';

// Components
import { Container } from 'react-bootstrap';
import { NavbarCustom } from './Components/NavbarCustom';
import { UserWrapper } from './Components/UserContext';
import { Landing } from './Components/Landing';
import { Login } from './Components/Login';
import { Register } from './Components/Register';
import { Profile } from './Components/Protected/Profile';
import { Admin } from './Components/Admin/Admin';

// Notifications
import { Toaster } from 'react-hot-toast';

const toastStyles = {
  style: {
    margin: '50px',
  },
  success: {
    style: {
      background: '#D4EDDA',
      border: '1px solid #C3E6CB',
    },
  },
  error: {
    style: {
      background: '#F9D7DA',
      border: '1px solid #F6C6CB',
    },
  },
};

const App = () => {
  return (
    <UserWrapper>
      <Router>
        <div className="App">
          <NavbarCustom />
          <Toaster position="top-center" toastOptions={toastStyles} />
          <Container className="Container-full" style={{ marginTop: 'max(80px, 5%)' }}>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/profile" component={Profile} />
              <Route path="/admin" component={Admin} />
            </Switch>
          </Container>
        </div>
      </Router>
    </UserWrapper>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
