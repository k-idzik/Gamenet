const handleLogin = (e) => {
  e.preventDefault();
    
  if ($('#user').val() == '' || $('#pass').val() == '') {
    handleError('Enter a username and password!');
    return false;
  }
  
  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  
  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
    
  if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleError('All fields are required to sign up!');
    return false;
  }
    
  if ($('#pass').val() !== $('#pass2').val()) {
    handleError('Passwords do not match!');
    return false;
  }
  
  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
  
  return false;
};

//React/JSX
//Login UI
const LoginWindow = (props) => {
  return(
    <form id='loginForm' name='loginForm' onSubmit={handleLogin} action='/login' method='POST' className='loginForm'>
      <h1 className='title'>The League of Gamers</h1>
      <input id='user' type='text' name='username' placeholder='Username' />
      <input id='pass' type='password' name='pass' placeholder='Password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Sign in' />
      <input className='formChange' type='button' value='Sign up' />
      <h3 id='errorMessage'></h3>
    </form>
  );
};

//Signup UI
const SignupWindow = (props) => {
  return(
    <form id='signupForm' name='signupForm' onSubmit={handleSignup} action='/signup' method='POST' className='loginForm'>
      <h1 className='title'>The League of Gamers</h1>
      <input id='user' type='text' name='username' placeholder='Username' />
      <input id='pass' type='password' name='pass' placeholder='Password' />
      <input id='pass2' type='password' name='pass2' placeholder='Retype password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Sign up' />
      <input className='formChange' type='button' value='Sign in' />
      <h3 id='errorMessage'></h3>
    </form>
  );
};

//Login rendering
const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />, //UI element to be created
    document.querySelector('#loginContent'), //Render target
  );
  
  //This is dumb, since it's just adding event listeners if the user spams back and forth
  //But it's the quickest way, and fixes csrf garbage
  document.querySelector('.formChange').addEventListener('mouseup', (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  
  document.querySelector('.title').style.marginTop = '5%';
};

//Signup rendering
const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />, //UI element to be created
    document.querySelector('#loginContent'), //Render target
  );
  
  //This is dumb, since it's just adding event listeners if the user spams back and forth
  //But it's the quickest way, and fixes csrf garbage
  document.querySelector('.formChange').addEventListener('mouseup', (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  
  document.querySelector('.title').style.marginTop = '2%';
};

//Button events
const setup = (csrf) => {
  createLoginWindow(csrf); //Render the login window by default
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