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
//Populate BasicInfo UI
const BasicInfo = (props) => {
  //props.data pulls from the data in the JSX tag
  //It has to be specified correctly in that parameter
  return(
    <h1>
      {props.data}
    </h1>
  );
};

//Load BasicInfo UI
const LoadBasicInfo = () => {
  //One call to get all the information we could ever want
  sendAjax('GET', '/getProfile', null, (data) => {
    ReactDOM.render(
      <BasicInfo data={data.profile.name} />,
      document.querySelector('#nameBI')
    );
    
    ReactDOM.render(
      <BasicInfo data={data.profile.age} />,
      document.querySelector('#ageBI')
    );
    
    ReactDOM.render(
      <BasicInfo data={data.profile.color} />,
      document.querySelector('#colorBI')
    );
  });
};
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
const setup = function(csrf) {
  //Render the BasicInfo UI
  LoadBasicInfo();
  
  //Render the Games UI
  //Games();
  
  //Resizing elements
  let profilePhotoDiv = document.querySelector('#profilePhotoDiv');
  let profilePhoto = profilePhotoDiv.querySelector('#profilePhoto');
  let basicInfoDiv = document.querySelector('#basicInfo');
  let gamesDiv = document.querySelector('#games');
  
  //Check once on load
  //Resize image
  profilePhoto.style.width = profilePhotoDiv.offsetWidth;
  profilePhoto.style.height = profilePhotoDiv.offsetWidth;

  //Resize elements
  profilePhotoDiv.style.height = profilePhotoDiv.offsetWidth;
  basicInfoDiv.style.height = profilePhoto.offsetWidth; //Align with the photo size, the containing div isn't always accurate enough
  gamesDiv.style.height = window.innerHeight - profilePhotoDiv.offsetHeight;
  
  //Resize profile image on element resize
  window.onresize = () => {
    //Resize image
    profilePhoto.style.width = profilePhotoDiv.offsetWidth;
    profilePhoto.style.height = profilePhotoDiv.offsetWidth;

    //Resize elements
    profilePhotoDiv.style.height = profilePhotoDiv.offsetWidth;
    basicInfoDiv.style.height = profilePhoto.offsetWidth; //Align with the photo size, the containing div isn't always accurate enough
    gamesDiv.style.height = window.innerHeight - profilePhotoDiv.offsetHeight;
  }
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