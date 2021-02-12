import axios from 'axios';
import rateLimit from 'axios-rate-limit';

//axios.defaults.baseURL = "https://127.0.0.1:5000";
//axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

export const axiosHttp = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 });

// the access token to store in memory and send back with requests.

let axios_token = '';

// withCredentials ensures the cookie with refresh token is set with request

axiosHttp.defaults.withCredentials = true;
axiosHttp.defaults.baseURL = '/api';

// Interceptor when access token needs to be refreshed

axiosHttp.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (
    (error.status === 401 || error.status === 403)
    && !originalRequest._retry
    // && originalRequest.url != "auth/refresh"
  ) {
    originalRequest._retry = true;
    const access_token = axiosHttp.get('auth/refresh')
      .then(response => {
        if (response.status === 200) {
          axios_token = access_token.data["access_token"];
        }
      })
      .catch(console.log);
    return axiosHttp(originalRequest);
  }
  return Promise.reject(error);
});

// Requires no refresh or access tokens

export const login = user => {
  return axiosHttp
    .post('/auth/login', {
      email: user.email,
      password: user.password
    })
    .then(response => {
      if (response && response.status === 200) {
        axios_token = response.data['access_token'];
        return response;
      }
    })
    .catch(error => { return error.response });
};

export const register = newUser => {
  return axiosHttp
    .post('/auth/register', newUser, { headers: { 'Authorization': `Bearer ${axios_token}` } })
    .then(response => {
      if (response && response.status === 201) {
        return response;
      }
    })
    .catch(error => { return error.response });
};

// Requires access token

export const deluser = id => {
  return axiosHttp
    .delete(`/admin/deluser/${id}`,
      { headers: { 'Authorization': `Bearer ${axios_token}` } }
    )
    .then(response => {
      if (response && response.status === 200) {
        return response;
      }
    })
    .catch(error => { return error.response });
};

export const getusers = () => {
  return axiosHttp
    .get('/admin/getusers',
      { headers: { 'Authorization': `Bearer ${axios_token}` } }
    )
    .then(response => {
      if (response && response.status === 200) {
        return response;
      }
    })
    .catch(error => { return error.response });
};

// Requires a refresh token

export const refresh = () => {
  return axiosHttp
    .get('auth/refresh')
    .then(response => {
      if (response && response.status === 200) {
        axios_token = response.data['access_token'];
        return response;
      }
    })
    .catch(error => { return error.response });
};

// log out

export const logout = () => {
  return axiosHttp
    .delete('auth/logout',
      { headers: { 'Authorization': `Bearer ${axios_token}` } }
    )
    .catch(error => { });
};