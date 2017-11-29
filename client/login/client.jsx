const handleLogin = (e) => {
  e.preventDefault();
    
  $('#domoMessage').animate({width: 'hide'}, 350);
    
  if ($('#user').val() == '' || $('#pass').val() == '') {
    handleError('RAWR! Username or password is empty');
    return false;
  }
    
  console.log($('input[name=_csrf]').val());
  
  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  
  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
    
  $('#domoMessage').animate({width: 'hide'}, 350);
    
  if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleError('RAWR! All fields are required');
    return false;
  }
    
  if ($('#pass').val() !== $('#pass2').val()) {
    handleError('RAWR! Passwords do not match');
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
    </form>
  );
  //onMouseUp={createSignupWindow(props.csrf)} 
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
    </form>
  );
  //onMouseUp={createLoginWindow(props.csrf)}
};

//Login rendering
const createLoginWindow = (csrf) => {
    console.dir(csrf);
  
  ReactDOM.render(
    <LoginWindow csrf={csrf} />, //UI element to be created
    document.querySelector('#content'), //Render target
  );
  
  //This is dumb, since it's just adding event listeners if the user spams back and forth
  //But it's the quickest way, and fixes csrf garbage
  document.querySelector('.formChange').addEventListener('mousedown', (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  
  document.querySelector('.title').style.marginTop = '5%';
};

//Signup rendering
const createSignupWindow = (csrf) => {
    console.dir(csrf);
  
  ReactDOM.render(
    <SignupWindow csrf={csrf} />, //UI element to be created
    document.querySelector('#content'), //Render target
  );
  
  //This is dumb, since it's just adding event listeners if the user spams back and forth
  //But it's the quickest way, and fixes csrf garbage
  document.querySelector('.formChange').addEventListener('mousedown', (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  
  document.querySelector('.title').style.marginTop = '2%';
};

//Button events
const setup = (csrf) => {
  const loginButton = document.querySelector('#loginButton');
  const signupButton = document.querySelector('#signupButton');
    
  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
    
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
    
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