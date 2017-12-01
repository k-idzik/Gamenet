'use strict';

//Username change checks
var changeUsername = function changeUsername(e) {
  e.preventDefault();

  //Check that all fields are filled out
  if ($('#user1').val() == '' || $('#user2').val() == '' || $('#pass').val() == '') {
    handleError('All fields are required!');
    return false;
  }

  //Check that new usernames match
  if ($('#user1').val() !== $('#user2').val()) {
    handleError('Usernames do not match!');
    return false;
  }

  //Go to controller to update username
  sendAjax('POST', $('#changeUsernameForm').attr('action'), $('#changeUsernameForm').serialize(), function () {
    document.querySelector('#errorMessage').textContent = 'Username updated!';
  });

  return false;
};

//Password change checks
var changePassword = function changePassword(e) {
  e.preventDefault();

  //Check that all fields are filled out
  if ($('#pass').val() == '' || $('#pass1').val() == '' || $('#pass2').val() == '') {
    handleError('All fields are required!');
    return false;
  }

  //Check that new passwords match
  if ($('#pass1').val() !== $('#pass2').val()) {
    handleError('New passwords do not match!');
    return false;
  }

  //Go to controller to update password
  sendAjax('POST', $('#changePasswordForm').attr('action'), $('#changePasswordForm').serialize(), function () {
    document.querySelector('#errorMessage').textContent = 'Password updated!';
  });

  return false;
};

//Username change UI
var SettingsUsername = function SettingsUsername(props) {
  return React.createElement(
    'form',
    { id: 'changeUsernameForm', name: 'changeUsernameForm', onSubmit: changeUsername, action: '/updateUsername', method: 'POST', className: 'loginForm' },
    React.createElement(
      'h1',
      { className: 'settingsTitle' },
      'Change username'
    ),
    React.createElement('input', { id: 'user1', type: 'text', name: 'username1', placeholder: 'New username' }),
    React.createElement('input', { id: 'user2', type: 'text', name: 'username2', placeholder: 'Retype new username' }),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'Password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Change username' }),
    React.createElement('h3', { id: 'errorMessage' })
  );
};

//Password change UI
var SettingsPassword = function SettingsPassword(props) {
  return React.createElement(
    'form',
    { id: 'changePasswordForm', name: 'changePasswordForm', onSubmit: changePassword, action: '/updatePassword', method: 'POST', className: 'loginForm' },
    React.createElement(
      'h1',
      { className: 'settingsTitle' },
      'Change password'
    ),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'Old password' }),
    React.createElement('input', { id: 'pass1', type: 'password', name: 'pass1', placeholder: 'New password' }),
    React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'Retype new password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Change password' }),
    React.createElement('h3', { id: 'errorMessage' })
  );
};

var setup = function setup(csrf) {
  var main = document.querySelector('#settingsMain');
  var setting0 = document.querySelector('#setting0');
  var setting1 = document.querySelector('#setting1');

  setting0.style.borderLeftColor = 'white'; //Default selected

  //Sidebar linking
  setting0.addEventListener('mouseup', function (e) {
    ReactDOM.render(React.createElement(SettingsUsername, { csrf: csrf }), //UI element to be created
    main //Render target
    );

    //Update selected
    setting0.style.borderLeftColor = 'white';
    setting1.style.borderLeftColor = '#BB0000';
  });
  setting1.addEventListener('mouseup', function (e) {
    ReactDOM.render(React.createElement(SettingsPassword, { csrf: csrf }), //UI element to be created
    main //Render target
    );

    //Update selected
    setting0.style.borderLeftColor = '#BB0000';
    setting1.style.borderLeftColor = 'white';
  });

  //Render the username UI by default
  ReactDOM.render(React.createElement(SettingsUsername, { csrf: csrf }), main);
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
