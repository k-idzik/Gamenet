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

//Load my pals from the server and render a PalList
var GetMyPals = function GetMyPals(props) {
  if (props.pals.length === 0) {
    return React.createElement(
      'h1',
      null,
      'You have no pals!'
    );
  }

  //Create UI for each pal
  //map is used to rip shit from arrays or whatever
  var palNodes = props.pals.profile.map(function (pal) {
    return React.createElement(
      'form',
      { className: 'pal', id: pal.owner, onMouseUp: VisitPal },
      React.createElement('img', { src: '/assets/img/profilePhoto.png', alt: pal.name, className: 'palIcon' }),
      React.createElement(
        'h3',
        { className: 'palName' },
        'Name: ',
        pal.name
      ),
      React.createElement(
        'h3',
        { className: 'palAge' },
        'Age: ',
        pal.age
      ),
      React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf })
    );
  });

  return React.createElement(
    'div',
    { className: 'palList' },
    palNodes
  );
};

//Load all pals from the server and render a PalList
var GetAllPals = function GetAllPals(props) {
  //Create UI for each pal
  //map is used to rip shit from arrays or whatever
  var palNodes = props.pals.profile.map(function (pal) {
    return React.createElement(
      'form',
      { className: 'pal', onMouseUp: AddPal },
      React.createElement('img', { src: '/assets/img/profilePhoto.png', alt: pal.name, className: 'palIcon' }),
      React.createElement(
        'h3',
        { className: 'palName' },
        'Name: ',
        pal.name
      ),
      React.createElement(
        'h3',
        { className: 'palAge' },
        'Age: ',
        pal.age
      ),
      React.createElement('input', { type: 'hidden', name: 'pal', value: pal.owner }),
      React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf })
    );
  });

  return React.createElement(
    'div',
    { className: 'palList' },
    palNodes
  );
};

//When visiting a pal
var VisitPal = function VisitPal(pal) {
  console.log('Visit');
};

//When adding pals
var AddPal = function AddPal(e) {
  e.preventDefault();

  //Go to controller to add pal
  sendAjax('POST', '/addPal', $(e.target).serialize(), function () {
    document.querySelector('#info').textContent = 'Pal added!';
  });
};

var setup = function setup(csrf) {
  var main = document.querySelector('#pals');
  var pals0 = document.querySelector('#pals0');
  var pals1 = document.querySelector('#pals1');
  var info = document.querySelector('#info');
  var currentlyRenderedMyPals = void 0; //What page is currently rendered

  pals0.style.borderBottomColor = 'white'; //Default selected

  //Sidebar linking
  pals0.addEventListener('mouseup', function (e) {
    if (!currentlyRenderedMyPals) {
      sendAjax('GET', '/getMyPals', null, function (data) {
        ReactDOM.render(React.createElement(GetMyPals, { pals: data, csrf: csrf }), main);
      });

      //Update selected
      pals0.style.borderBottomColor = 'white';
      pals1.style.borderBottomColor = '#BB0000';

      info.innerHTML = 'Click a pal to visit!';
      currentlyRenderedMyPals = true;
    }
  });
  pals1.addEventListener('mouseup', function (e) {
    if (currentlyRenderedMyPals) {
      sendAjax('GET', '/getAllPals', null, function (data) {
        ReactDOM.render(React.createElement(GetAllPals, { pals: data, csrf: csrf }), main);
      });

      //Update selected
      pals0.style.borderBottomColor = '#BB0000';
      pals1.style.borderBottomColor = 'white';

      info.innerHTML = 'Click to add a pal!';
      currentlyRenderedMyPals = false;
    }
  });

  //Render the user pals list by default
  sendAjax('GET', '/getMyPals', null, function (data) {
    ReactDOM.render(React.createElement(GetMyPals, { pals: data, csrf: csrf }), main);

    info.innerHTML = 'Click a pal to visit!';
    currentlyRenderedMyPals = true;
  });

  var palsDiv = document.querySelector('#pals');

  //Check once on load
  //Resize elements
  palsDiv.style.height = window.innerHeight - 121;

  //Resize profile image on element resize
  window.onresize = function () {
    //Resize elements
    palsDiv.style.height = window.innerHeight - 121;
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
