const BASE_URL = 'http://localhost:3000';

const authProvider = {
  login: login,
  checkError: checkError,
  checkAuth: checkAuth,
  logout: logout,
  getIdentity: getIdentity,
  getPermissions: () => {
    return Promise.resolve();
  },
};

async function login({ username, password }) {
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
      if (!data.success || data?.user?.role !== 'admin') {
        throw new Error('Login or password is invalid');
      }
      localStorage.setItem('auth', JSON.stringify(data.user));
    })
    .catch(err => {
      throw new Error(err.message);
    });
}

async function checkError(error) {
  const status = error.status;
  if (status === 401 || status === 403) {
    return Promise.reject({ redirectTo: '/unauthorized', logoutUser: true });
  }

  return Promise.resolve();
}

async function checkAuth() {
  const request = new Request(`${BASE_URL}/api/auth/isLoggedIn`, {
    method: 'GET',
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
    .catch(err => {
      throw new Error(err.message);
    });
}

async function logout() {
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
}

function getIdentity() {
  try {
    const { id, fullName, avatar } = JSON.parse(localStorage.getItem('auth'));
    return Promise.resolve({ id, fullName, avatar: `http://localhost:3000/api/images/${avatar}` });
  } catch (error) {
    return Promise.reject(error);
  }
}

export default authProvider;
