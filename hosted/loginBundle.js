'use strict';

//Login checks
var handleLogin = function handleLogin(e) {
  e.preventDefault();

  //Check that username and password have been entered
  if ($('#user').val() == '' || $('#pass').val() == '') {
    handleError('Enter a username and password!');
    return false;
  }

  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

  return false;
};

//Signup checks
var handleSignup = function handleSignup(e) {
  e.preventDefault();

  //Check that all info has been entered
  if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleError('All fields are required to sign up!');
    return false;
  }

  //Check that passwords match
  if ($('#pass').val() !== $('#pass2').val()) {
    handleError('Passwords do not match!');
    return false;
  }

  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);

  return false;
};

//React/JSX
//Login UI
var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    'form',
    { id: 'loginForm', name: 'loginForm', onSubmit: handleLogin, action: '/login', method: 'POST', className: 'loginForm' },
    React.createElement(
      'h1',
      { className: 'title' },
      'The League of Gamers'
    ),
    React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'Username' }),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'Password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign in' }),
    React.createElement('input', { className: 'formChange', type: 'button', value: 'Sign up' }),
    React.createElement('h3', { id: 'errorMessage' })
  );
};

//Signup UI
var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    'form',
    { id: 'signupForm', name: 'signupForm', onSubmit: handleSignup, action: '/signup', method: 'POST', className: 'loginForm' },
    React.createElement(
      'h1',
      { className: 'title' },
      'The League of Gamers'
    ),
    React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'Username' }),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'Password' }),
    React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'Retype password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign up' }),
    React.createElement('input', { className: 'formChange', type: 'button', value: 'Sign in' }),
    React.createElement('h3', { id: 'errorMessage' })
  );
};

//Login rendering
var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), //UI element to be created
  document.querySelector('#loginContent') //Render target
  );

  //This is dumb, since it's just adding event listeners if the user spams back and forth
  //But it's the quickest way, and fixes csrf garbage
  document.querySelector('.formChange').addEventListener('mouseup', function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  document.querySelector('.title').style.marginTop = '5%';
};

//Signup rendering
var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), //UI element to be created
  document.querySelector('#loginContent') //Render target
  );

  //This is dumb, since it's just adding event listeners if the user spams back and forth
  //But it's the quickest way, and fixes csrf garbage
  document.querySelector('.formChange').addEventListener('mouseup', function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  document.querySelector('.title').style.marginTop = '2%';
};

//Button events
var setup = function setup(csrf) {
  createLoginWindow(csrf); //Render the login window by default
};

//Get the csrf token from the server
var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

//Get the token when the page loads
$(document).ready(function () {
  getToken();
});
'use strict';

var handleError = function handleError(message) {
  document.querySelector('#errorMessage').textContent = message;
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });
};
