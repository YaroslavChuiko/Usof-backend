const BASE_URL = 'http://localhost:3000';

const authProvider = {
  login: async ({ username, password }) => {
    const request = new Request(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ login: username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.type !== 'success' || data?.user?.role !== 'admin') {
          throw new Error('Login or password is invalid');
        }
        localStorage.setItem('auth', JSON.stringify(data.user));
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  },
  checkError: error => {
    const status = error.status;
    if (status === 401 || status === 403) {
      // localStorage.removeItem('auth');
      // return Promise.reject({ redirectTo: '/credentials-required' });
      return Promise.reject({ redirectTo: '/unauthorized', logoutUser: true });
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: async () => {
    const request = new Request(`${BASE_URL}/api/auth/isLoggedIn`, {
      method: 'GET',
      // body: JSON.stringify({ login, password }),
      // headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (!data.success) {
          throw new Error('Only for authorized users');
        }
        return data.success ? Promise.resolve() : Promise.reject({ redirectTo: '/no-access' });
      //  return data.success ? Promise.resolve() : Promise.reject();
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  },
  logout: async () => {
    const request = new Request(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        Promise.resolve();
      })
      .catch(() => {
        throw new Error('Network error');
      });
  },
  getIdentity: () => {
    try {
      const { id, fullName, avatar } = JSON.parse(localStorage.getItem('auth'));
      return Promise.resolve({ id, fullName, avatar: `http://localhost:3000/api/images/${avatar}` });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: () => {
    return Promise.resolve();
  },
};

export default authProvider;
