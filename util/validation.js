import prisma from "../lib/prisma";
import bcrypt from 'bcrypt';
import { TYPE_ERROR, TYPE_SUCCESS } from "./const";

export function validateData(userData) {
  const { login, password, repassword, firstName, lastName, email } = userData;
  const loginErrorMsg = validateLogin(login);
  const firstNameErrorMsg = validateName(firstName, 'first name');
  const lastNameErrorMsg = validateName(lastName, 'last name');
  const passwordErrorMsg = validatePassword(password, repassword);
  const emailErrorMsg = validateEmail(email);
  const result = {
    type: TYPE_SUCCESS,
    message: '',
  };

  if (loginErrorMsg || firstNameErrorMsg || lastNameErrorMsg || passwordErrorMsg || emailErrorMsg) {
    result.message = loginErrorMsg || firstNameErrorMsg || lastNameErrorMsg || passwordErrorMsg || emailErrorMsg;
    result.type = TYPE_ERROR;
  }

  return result;
}

function validateLogin(login) {
  if (login.length < 4) 
      return 'The login length must be at least 4 symbols';
  if (!/^[a-zA-Z]/.test(login))
      return 'The login must starts with a letter';
  if (!/^[a-zA-Z0-9]+$/.test(login)) 
      return 'The login must containt only a-z, A-Z, 0-9';
  if (login.length > 16) 
      return 'The login length must not exceed 16 symbols';

  return '';
}

function validateName(name, nameTitle = 'first name') {
  if (name.length < 2) 
      return `The ${nameTitle} length must be at least 4 symbols`;
  if (!/^[a-zA-Z]+$/.test(name))
      return `The ${nameTitle} must containt only a-z, A-Z`;
  if (name.length > 16) 
      return `The ${nameTitle} length must not exceed 16 symbols`;

  return '';
}

function validatePassword(password, repassword) {
  if (password.length < 4) 
      return 'The password length must be at least 4 symbols';
  if (!/^[a-zA-Z0-9]+$/.test(password)) 
      return 'The password must containt only a-z, A-Z, 0-9';
  if (!/(?=.*\d)/.test(password))
      return 'The password should contain at least one digit';
  if (!/(?=.*[a-z])/.test(password)) 
      return 'The password should contain at least one lower case';
  if (!/(?=.*[A-Z])/.test(password))
      return 'The password should contain at least one upper case';
  if (password.length > 16) 
      return 'The password length must not exceed 16 symbols';
  if (password !== repassword)
      return 'Passwords do not match';

  return '';
}


function validateEmail(email){
  // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  // const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const re = /\S+@\S+\.\S+/; ///^[^\s@]+@[^\s@]+\.[^\s@]+$/ To prevent matching multiple @ signs
  if (!re.test(email))
    return 'The email is not valid';
    
  return '';
};

export async function checkUnique(userData) {
  const {login, email} = userData;
  let loginErrorMsg;
  let emailErrorMsg;
  const result = {
    type: TYPE_SUCCESS,
    message: 'You are successfully registered!',
  };
  
  try {
    loginErrorMsg = await checkUniqueLogin(login);
    emailErrorMsg = await checkUniqueEmail(email);
  } catch (error) {
    throw error
  }
  
  if (loginErrorMsg || emailErrorMsg) {
    result.message = loginErrorMsg || emailErrorMsg
    result.type = TYPE_ERROR;
  }
  
  return result;
}

async function checkUniqueLogin(login) {
  let result;
  try {
    result = await prisma.user.findUnique({
      where: {
        login: login,
      }
    }).catch(err => console.log(err)); //! delete catch
  } catch (error) {
    throw new Error(`Database error`);
    // throw error;
  }

  if (result)
      return 'The user with this login already exists';

  return '';
}

async function checkUniqueEmail(email) {
  let result;
  try {
    result = await prisma.user.findUnique({
      where: {
        email: email,
      }
    }).catch(err => console.log(err)); //! delete catch
  } catch (error) {
    throw new Error(`Database error`);
  }

  if (result)
      return 'The user with this email already exists';

  return '';
}

export function checkUser(user, password) {
  let result = {
    type: TYPE_SUCCESS,
    message: 'You are successfully logged!',
  };

  if (!(user && bcrypt.compareSync(password, user.password))) {
    result.type = TYPE_ERROR;
    result.text = 'Login or password is invalid';
    return result;
  }

  return result;
}
