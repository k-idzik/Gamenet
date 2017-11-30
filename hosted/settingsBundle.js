'use strict';

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  //$('#domoMessage').animate({width: 'hide'}, 350);

  if ($('#domoName').val() == '' || $('#domoAge').val() == '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

//Username change UI
var SettingsUsername = function SettingsUsername(props) {
  return React.createElement(
    'form',
    { id: 'loginForm', name: 'loginForm', onSubmit: handleDomo, action: '/login', method: 'POST', className: 'loginForm' },
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

//Password change UI
var SettingsPassword = function SettingsPassword(props) {
  return React.createElement(
    'form',
    { id: 'loginForm', name: 'loginForm', onSubmit: handleDomo, action: '/login', method: 'POST', className: 'loginForm' },
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

var setup = function setup(csrf) {
  //Render the MakeDomo UI
  ReactDOM.render(React.createElement(SettingsUsername, { csrf: csrf }), document.querySelector('#content'));

  //Render the DomoList UI
  ReactDOM.render(React.createElement(SettingsPassword, { csrf: csrf }), document.querySelector('#content'));
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