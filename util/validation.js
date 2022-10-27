import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

export function validateData(userData) {
  const { login, password, repassword, firstName, lastName, email } = userData;
  const loginErrorMsg = validateLogin(login);
  const firstNameErrorMsg = validateName(firstName);
  const lastNameErrorMsg = validateName(lastName);
  const emailErrorMsg = validateEmail(email);
  const passwordErrorMsg = validatePassword(password);
  const repasswordErrorMsg = comparePasswords(password, repassword);
  const result = {
    success: true,
    message: 'You are successfully registered',
    errors: {}
  };

  if (loginErrorMsg || firstNameErrorMsg || lastNameErrorMsg || emailErrorMsg || passwordErrorMsg || repasswordErrorMsg) {
    result.message = 'Register error';
    result.success = false;
    result.errors.login = loginErrorMsg ? loginErrorMsg : null;
    result.errors.firstName = firstNameErrorMsg ? firstNameErrorMsg : null;
    result.errors.lastName = lastNameErrorMsg ? lastNameErrorMsg : null;
    result.errors.email = emailErrorMsg ? emailErrorMsg : null;
    result.errors.password = passwordErrorMsg ? passwordErrorMsg : null;
    result.errors.repassword = repasswordErrorMsg ? repasswordErrorMsg : null;
  }

  return result;
}

function validateLogin(login) {
  const MIN_LENGTH = 4;
  const MAX_LENGTH = 16;
  if (login.length < MIN_LENGTH) return `Length must be at least ${MIN_LENGTH} symbols`;
  if (!/^[a-zA-Z]/.test(login)) return 'Must start with a letter';
  if (!/^[a-zA-Z0-9]+$/.test(login)) return 'Must containt only a-z, A-Z, 0-9';
  if (login.length > MAX_LENGTH) return `Length must not exceed ${MAX_LENGTH} symbols`;

  return '';
}

function validateName(name) {
  const MIN_LENGTH = 2;
  const MAX_LENGTH = 16;
  if (name.length < MIN_LENGTH) return `Length must be at least ${MIN_LENGTH} symbols`;
  if (!/^[a-zA-Z]+$/.test(name)) return `Must containt only a-z, A-Z`;
  if (name.length > MAX_LENGTH) return `Length must not exceed ${MAX_LENGTH} symbols`;

  return '';
}

export function validatePassword(password) {
  const MIN_LENGTH = 4;
  const MAX_LENGTH = 16;
  if (password.length < MIN_LENGTH) return `Length must be at least ${MIN_LENGTH} symbols`;
  if (!/^[a-zA-Z0-9]+$/.test(password)) return 'Must containt only a-z, A-Z, 0-9';
  if (!/(?=.*\d)/.test(password)) return 'Should contain at least one digit';
  if (!/(?=.*[a-z])/.test(password)) return 'Should contain at least one lower case letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Should contain at least one upper case letter';
  if (password.length > MAX_LENGTH) return `Length must not exceed ${MAX_LENGTH} symbols`;

  return '';
}

function comparePasswords(password, repassword) {
  if (password !== repassword || !repassword) return 'Passwords do not match';

  return '';
}

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/; ///^[^\s@]+@[^\s@]+\.[^\s@]+$/ To prevent matching multiple @ signs
  if (!re.test(email)) return 'The email is not valid';

  return '';
}

export async function checkUnique(userData) {
  const { login, email } = userData;
  let loginErrorMsg;
  let emailErrorMsg;
  const result = {
    success: true,
    message: 'You are successfully registered',
    errors: {}
  };

  try {
    loginErrorMsg = await checkUniqueLogin(login);
    emailErrorMsg = await checkUniqueEmail(email);
  } catch (error) {
    throw error;
  }

  if (loginErrorMsg || emailErrorMsg) {
    result.message = 'Register error';
    result.success = false;
    result.errors.login = loginErrorMsg ? loginErrorMsg : null;
    result.errors.email = emailErrorMsg ? emailErrorMsg : null;
  }

  return result;
}

async function checkUniqueLogin(login) {
  let result;
  try {
    result = await prisma.user.findUnique({
      where: {
        login: login,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Database error`);
  }

  if (result) return 'A user with this login already exists';

  return '';
}

async function checkUniqueEmail(email) {
  let result;
  try {
    result = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Database error`);
  }

  if (result) return 'A user with this email already exists';

  return '';
}

export function checkUser(user, password) {
  let result = {
    success: true,
    message: 'You are successfully logged!',
  };

  if (!(user && bcrypt.compareSync(password, user.password))) {
    result.success = false;
    result.message = 'Login or password is invalid';
    return result;
  }

  return result;
}

export function validateUserDataToUpdate(firstName, lastName, login) {
  const result = {
    success: true,
    firstName: validateName(firstName),
    lastName: validateName(lastName),
    login: validateLogin(login),
  };

  if (result.firstName || result.lastName || result.login) {
    result.success = false;
  }

  return result;
};



