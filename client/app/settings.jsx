//Username change checks
const changeUsername = (e) => {
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
  sendAjax('POST', $('#changeUsernameForm').attr('action'), $('#changeUsernameForm').serialize(), function() {
    document.querySelector('#errorMessage').textContent = 'Username updated!';
  });

  return false;
};

//Password change checks
const changePassword = (e) => {
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
  sendAjax('POST', $('#changePasswordForm').attr('action'), $('#changePasswordForm').serialize(), function() {
    document.querySelector('#errorMessage').textContent = 'Password updated!';
  });

  return false;
};

//Profile update checks
const updateProfile = (e) => {
  e.preventDefault();

  // If no data is entered
  if ($('#name').val() == '' && $('#age').val() == '' && $('#fColor').val() == '') {
    document.querySelector('#errorMessage').textContent = 'Nothing to update!';
    return false;
  }

  //Go to controller to update password
  sendAjax('POST', $('#updateProfileForm').attr('action'), $('#updateProfileForm').serialize(), function() {
    document.querySelector('#errorMessage').textContent = 'Profile updated!';
  });

  return false;
};

//Username change UI
const SettingsUsername = (props) => {
  return(
    <form id='changeUsernameForm' name='changeUsernameForm' onSubmit={changeUsername} action='/updateUsername' method='POST' className='loginForm'>
      <h1 className='settingsTitle'>Change username</h1>
      <input id='user1' type='text' name='username1' placeholder='New username' />
      <input id='user2' type='text' name='username2' placeholder='Retype new username' />
      <input id='pass' type='password' name='pass' placeholder='Password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Change username' />
      <h3 id='errorMessage'></h3>
    </form>
  );
};

//Password change UI
const SettingsPassword = (props) => {
  return(
    <form id='changePasswordForm' name='changePasswordForm' onSubmit={changePassword} action='/updatePassword' method='POST' className='loginForm'>
      <h1 className='settingsTitle'>Change password</h1>
      <input id='pass' type='password' name='pass' placeholder='Old password' />
      <input id='pass1' type='password' name='pass1' placeholder='New password' />
      <input id='pass2' type='password' name='pass2' placeholder='Retype new password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Change password' />
      <h3 id='errorMessage'></h3>
    </form>
  );
};

//Profile update UI
const SettingsProfile = (props) => {
  return(
    <form id='updateProfileForm' name='updateProfileForm' onSubmit={updateProfile} action='/updateProfile' method='POST' className='profileForm'>
      <label htmlFor='name'>Name:</label>
      <input id='name' type='text' name='name' placeholder='Enter name' />
      
      <label htmlFor='age'>Age:</label>
      <input id='age' type='number' name='age' placeholder='Enter age' />
      
      <label htmlFor='fColor'>Favorite Color:</label>
      <input id='fColor' type='text' name='fColor' placeholder='Enter favorite color' />
      
      <div id='settingsTriBelow'>
        <input type='hidden' name='_csrf' value={props.csrf} />
        <input className='formSubmit' type='submit' value='Update profile' />
        <h3 id='errorMessage'></h3>
      </div>
    </form>
  );
};


const setup = function(csrf) {
  const main = document.querySelector('#settingsMain');
  const setting0 = document.querySelector('#setting0');
  const setting1 = document.querySelector('#setting1');
  const setting2 = document.querySelector('#setting2');
  
  setting0.style.borderLeftColor = 'white'; //Default selected
  
  //Sidebar linking
  setting0.addEventListener('mouseup', (e) => {
    ReactDOM.render(
      <SettingsUsername csrf={csrf} />, //UI element to be created
      main, //Render target
    );
    
    //Update selected
    setting0.style.borderLeftColor = 'white';
    setting1.style.borderLeftColor = '#BB0000';
    setting2.style.borderLeftColor = '#BB0000';
  });
  setting1.addEventListener('mouseup', (e) => {
    ReactDOM.render(
      <SettingsPassword csrf={csrf} />, //UI element to be created
      main, //Render target
    );
    
    //Update selected
    setting0.style.borderLeftColor = '#BB0000';
    setting1.style.borderLeftColor = 'white';
    setting2.style.borderLeftColor = '#BB0000';
  });
  setting2.addEventListener('mouseup', (e) => {
    ReactDOM.render(
      <SettingsProfile csrf={csrf} />, //UI element to be created
      main, //Render target
    );
    
    //Update selected
    setting0.style.borderLeftColor = '#BB0000';
    setting1.style.borderLeftColor = '#BB0000';
    setting2.style.borderLeftColor = 'white';
  });
  
  //Render the username UI by default
  ReactDOM.render(
    <SettingsUsername csrf={csrf} />,
    main
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