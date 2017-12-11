'use strict';

//const handleDomo = (e) => {
//  e.preventDefault();
//
//  //$('#domoMessage').animate({width: 'hide'}, 350);
//    
//  if ($('#domoName').val() == '' || $('#domoAge').val() == '') {
//    handleError('RAWR! All fields are required');
//    return false;
//  }
//
//  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function() {
//    loadDomosFromServer();
//  });
//
//  return false;
//};
//
////BasicInfo UI
//const BasicInfo = () => {
//  sendAjax('GET', '/getProfile', null, (data) => {
//    ReactDOM.render(
//      <BasicInfo domos={data.domos} />,
//      document.querySelector('#domos')
//    );
//};
//
////Games UI
//const Games = () => {
//  //No games
//  console.dir(props.profile);
//  if (props.profile.length === 0) {
//    return(
//      <div className='gamesList'>
//        <h3 className='emptyGames'>No Domos yet</h3>
//      </div>
//    );
//  }
//  
//  //Create UI for each Domo
//  //<img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' /> //Might do images later
//  const domoNodes = props.profile.map(function(domo) {
//    return(
//      <div key={domo._id} className='domo'>
//        
//        <h3 className='domoName'>Name: {domo.name}</h3>
//        <h3 className='domoAge'>Age: {domo.age}</h3>
//      </div>
//    );
//  });
//  
//  //Render out the Domo UIs
//  return(
//    <dim className='domoList'>
//      {domoNodes}
//    </dim>
//  );
//};
//
////Load Domos from the server and render a DomoList
//const loadDomosFromServer = () => {
//  sendAjax('GET', '/getProfile', null, (data) => {
//    ReactDOM.render(
//      <DomoList domos={data.domos} />,
//      document.querySelector('#domos')
//    );
//  });
//};
//
var setup = function setup(csrf) {
  //Render the BasicInfo UI
  //BasicInfo();

  //Render the Games UI
  //Games();

  //Resizing elements
  var profilePhotoDiv = document.querySelector('#profilePhotoDiv');
  var profilePhoto = profilePhotoDiv.querySelector('#profilePhoto');
  var basicInfoDiv = document.querySelector('#basicInfo');

  //Check once on load
  if (profilePhotoDiv.offsetWidth < 252) {
    //Resize image
    profilePhoto.style.width = profilePhotoDiv.offsetWidth;
    profilePhoto.style.height = profilePhotoDiv.offsetWidth;

    //Resize elements
    profilePhotoDiv.style.height = profilePhotoDiv.offsetWidth;
    basicInfoDiv.style.height = profilePhotoDiv.offsetWidth;
  }

  //Resize profile image on element resize
  window.onresize = function () {
    //if (profilePhotoDiv.offsetWidth < 252) {
    //Resize image
    profilePhoto.style.width = profilePhotoDiv.offsetWidth;
    profilePhoto.style.height = profilePhotoDiv.offsetWidth;

    //Resize elements
    profilePhotoDiv.style.height = profilePhotoDiv.offsetWidth;
    basicInfoDiv.style.height = profilePhotoDiv.offsetWidth;
    //}
  };
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
