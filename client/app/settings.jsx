const handleDomo = (e) => {
  e.preventDefault();

  //$('#domoMessage').animate({width: 'hide'}, 350);
    
  if ($('#domoName').val() == '' || $('#domoAge').val() == '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function() {
    loadDomosFromServer();
  });

  return false;
};

////Sidebar UI
//const SettingsSidebar = (props) => {
//  return(
//    <form id='loginForm' name='loginForm' onSubmit={handleDomo} action='/login' method='POST' className='loginForm'>
//      <h1 className='title'>The League of Gamers</h1>
//      <input id='user' type='text' name='username' placeholder='Username' />
//      <input id='pass' type='password' name='pass' placeholder='Password' />
//      <input type='hidden' name='_csrf' value={props.csrf} />
//      <input className='formSubmit' type='submit' value='Sign in' />
//      <input className='formChange' type='button' value='Sign up' />
//      <h3 id='errorMessage'></h3>
//    </form>
//  );
//};

//Username change UI
const SettingsUsername = (props) => {
  return(
    <form id='loginForm' name='loginForm' onSubmit={handleDomo} action='/login' method='POST' className='loginForm'>
      <h1 className='title'>Username</h1>
      <input id='user' type='text' name='username' placeholder='Username' />
      <input id='pass' type='password' name='pass' placeholder='Password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Sign in' />
      <input className='formChange' type='button' value='Sign up' />
      <h3 id='errorMessage'></h3>
    </form>
  );
};

//Password change UI
const SettingsPassword = (props) => {
  return(
    <form id='loginForm' name='loginForm' onSubmit={handleDomo} action='/login' method='POST' className='loginForm'>
      <h1 className='title'>Password</h1>
      <input id='user' type='text' name='username' placeholder='Username' />
      <input id='pass' type='password' name='pass' placeholder='Password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Sign in' />
      <input className='formChange' type='button' value='Sign up' />
      <h3 id='errorMessage'></h3>
    </form>
  );
};

const setup = function(csrf) {
  //Sidebar linking
  document.querySelector('#setting0').addEventListener('mouseup', (e) => {
    ReactDOM.render(
      <SettingsUsername csrf={csrf} />, //UI element to be created
      document.querySelector('#settingsMain'), //Render target
    );
  });
  document.querySelector('#setting1').addEventListener('mouseup', (e) => {
    ReactDOM.render(
      <SettingsPassword csrf={csrf} />, //UI element to be created
      document.querySelector('#settingsMain'), //Render target
    );
  });
  
  //Render the username UI by default
  ReactDOM.render(
    <SettingsUsername csrf={csrf} />,
    document.querySelector('#settingsMain')
  );
};

//Get the csrf token from the server
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
      setup(result.csrfToken);
  });
};

//Get the token when the page loads
$(document).ready(function() {
    getToken();
});