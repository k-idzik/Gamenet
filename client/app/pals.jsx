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
////Domo UI
//const DomoForm = (props) => {
//  return(
//    <form id='domoForm' name='domoForm' onSubmit={handleDomo} action='/profile' method='POST' className='domoForm'>
//      <label htmlFor='name'>Name: </label>
//      <input id='domoName' type='text' name='name' placeholder='Domo Name' />
//      <label htmlFor='age'>Age: </label>
//      <input id='domoAge' type='text' name='age' placeholder='Domo Age' />
//      <input type='hidden' name='_csrf' value={props.csrf} />
//      <input className='makeDomoSubmit' type='submit' value='Make Domo' />
//    </form>
//  );
//};
//
////Determine what Domos to draw
//const DomoList = function(props) {
//  //No Domos
//  if (props.profile.length === 0) {
//    return(
//      <div className='domoList'>
//        <h3 className='emptyDomo'>No Domos yet</h3>
//      </div>
//    );
//  }
//  
//  //Create UI for each Domo
//  const domoNodes = props.profile.map(function(domo) {
//    return(
//      <div key={domo._id} className='domo'>
//        <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
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

//Load all pals from the server and render a DomoList
const GetAllPals = (props) => {
  //Create UI for each pal
  //map is used to rip shit from arrays or whatever
  const palNodes = props.pals.profile.map(function(pal) {
    return(
      <button className='pal' id={pal.owner}>
        <img src='/assets/img/profilePhoto.png' alt={pal.name} className='palIcon' />
        <h3 className='palName'>Name: {pal.name}</h3>
        <h3 className='palAge'>Age: {pal.age}</h3>
      </button>
    );
  });
  
  return(
    <div className='palList'>
      {palNodes}
    </div>
  );
};

//Add listeners for your pals
const MyPalPageListeners = (palList) => {
  palList = document.querySelectorAll('.pal'); //Recapture pals
  
  for (let i = 0; i < palList.length; i++) {
    palList[i].removeEventListener('mouseup', VisitPal); //Remove event listener to prevent duplicates
    palList[i].removeEventListener('mouseup', AddPal); //Remove event listener to prevent duplicates
    
    palList[i].addEventListener('mouseup', VisitPal);
  }
};

//When visiting a pal
const VisitPal = () => {
  
};

//Add listeners for all pals
const AllPalPageListeners = (palList) => {
  palList = document.querySelectorAll('.pal'); //Recapture pals
  
  for (let i = 0; i < palList.length; i++) {
    palList[i].removeEventListener('mouseup', VisitPal); //Remove event listener to prevent duplicates
    palList[i].removeEventListener('mouseup', AddPal); //Remove event listener to prevent duplicates
    
    palList[i].addEventListener('mouseup', AddPal);
  }
};

//When adding pals
const AddPal = () => {
  
};

const setup = function(csrf) {
  const main = document.querySelector('#pals');
  const pals0 = document.querySelector('#pals0');
  const pals1 = document.querySelector('#pals1');
  let info = document.querySelector('#info');
  let palList = []; //Select all the pals when needed
  
  pals0.style.borderBottomColor = 'white'; //Default selected
  
  //Sidebar linking
  pals0.addEventListener('mouseup', (e) => {
    sendAjax('GET', '/getAllPals', null, (data) => {
      ReactDOM.render(
        <GetAllPals pals={data} />,
        main
      );
    });
    
    //Update selected
    pals0.style.borderBottomColor = 'white';
    pals1.style.borderBottomColor = '#BB0000';

    info.innerHTML = 'Click a pal to visit!';
    
    MyPalPageListeners(palList); //Set up the pal listeners
  });
  pals1.addEventListener('mouseup', (e) => {
    sendAjax('GET', '/getAllPals', null, (data) => {
      ReactDOM.render(
        <GetAllPals pals={data} />,
        main
      );
    });
    
    //Update selected
    pals0.style.borderBottomColor = '#BB0000';
    pals1.style.borderBottomColor = 'white';

    info.innerHTML = 'Click to add a pal!';
    
    AllPalPageListeners(palList); //Set up the pal listeners
  });
  
  //Render the user pals list by default
  sendAjax('GET', '/getAllPals', null, (data) => {
    ReactDOM.render(
      <GetAllPals pals={data} />,
      main
    );
    
    info.innerHTML = 'Click a pal to visit!';
    MyPalPageListeners(palList); //Set up the pal listeners
  });
  
  let palsDiv = document.querySelector('#pals');
  
  //Check once on load
  //Resize elements
  palsDiv.style.height = window.innerHeight - 121;
  
  //Resize profile image on element resize
  window.onresize = () => {
    //Resize elements
    palsDiv.style.height = window.innerHeight - 121;
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