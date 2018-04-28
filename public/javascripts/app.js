$(document).ready(function(){
console.log("yea!");
let $locList;
let allLocs = [];
//signup
	$("#signup-form").on("submit", function(e){
		e.preventDefault();
		  var signupData = {
        email: $("#email-input").val(),
        passwordDigest: $('#password-input').val(),
        child: $('#childName-input').val(),
        ppphone: $('#ppphone-input').val()
      };
        console.log(signupData);
  	 	$.ajax({
        method: 'POST',
        url: '/signup',
        data: signupData,
        success: signupSuccess,
        error: signupError
      });
	});
//login
	$("#login-form").on("submit", function(e){
		e.preventDefault();
		  var loginData = {
        email: $("#email-input").val(),
        passwordDigest: $('#password-input').val(),
      };
  			console.log(loginData);
  	 	$.ajax({
        method: 'POST',
        url: '/login',
        data: loginData,
        success: loginSuccess,
        error: loginError
      });
    });  


    //signup success function
    function signupSuccess () {
      window.location.href = '/profile';
    }

    //signup error function
    function signupError () {
      alert('Error, please try again');
    }

    //login success function
    function loginSuccess () {
      window.location.href = '/profile';
    }

    //login error function 
    function loginError () {
      alert('Error logging in, please try again')
    }
//send text message
  $("#arrived").on("submit", function(e){
    e.preventDefault();
    //twilio send message
      let msgData = {
        name: './models/User.Name',
        loc: './models/User.Loc'
      }
    $.ajax({
      method: 'POST',
      url: '/msg',
      data: msgData,
      success: msgSuccess,
      error: msgError
      });

  })

  $locList = $('#target');
 
  $.ajax({
    method: 'GET', //getting all of the data from database
    url: '/profile/loc', //on this url
    success: handleSuccess, //calls handleSuccess on success
    error: handleError //throws error on error
  });

  $("#newLoc").on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST', //post method
      url: '/profile/loc', //url to post on
      data: $('#newLoc').serialize(), //serializing the form object
      success: newLocSuccess,
      error: newLocError
    });
  });

  $locList.on('click', '.deleteBtn', function() {
    console.log('clicked delete button to, /profile/loc/' + $(this).attr('data-id'))
    $.ajax({
      method: 'DELETE',
      url: '/profile/loc/'+$(this).attr('data-id'),
      success: deleteLocSuccess,
      error: deleteLocError
    });
  });

  $locList.on('click', '.updateBtn', function() {
    console.log('clicked update button to,  /loc/'+$(this).attr('data-id'));
    $.ajax({
      method: 'PUT',
      url: '/loc/'+$(this).attr('data-id'),
      data: $('#newLoc').serialize(),
      success: updateLocSuccess,
      error: updateLocError
    });
  });

  function getLocHtml(locList) {
  return `<a class="dropdown-item" data-toggle="modal" data-target=".crud">
            Location <b>${locList.loc}</b>
          </a>`;
  }

  function getAllLocHtml(loc) {
  return loc.map(getLocHtml).join("");
  //function to render all locations to view
  function render () {
  // $locList.empty();// empty existing posts from view
    var locHtml = getAllLocHtml(allLocs); // pass `allLocs` into the template function
    $locList.append(locHtml);// append html to the view
  }};

  function handleSuccess(json) {
    allLocs = json;//assigning the value of the json object into the empty array
    if (allLocs > 0) {
    render();
  }}

  function handleError(e) {
    console.log('uh oh');
    $('#target').text('Failed to load locations');
  }

  function newLocSuccess(json) {
    $('#newLoc input').val(''); //clearing the input fields after successful post
    console.log(json);
    allLocs.push(json); //pushing all data from the array into json
    render();
  }

  function newLocError() {
    console.log('new location error!');
  }

  function deleteLocSuccess(json) {
    var locId = json;
    console.log('delete loc', locId);
    // find the loc with the correct ID and remove it from our allLocs array
    for(var index = 0; index < allLocs.length; index++) {
      if(allLocs[index]._id === locId) {
       allLocs.splice(index, 1);
        break;  
      }
    }
    render();
  }

  function deleteLocError() {
    console.log('delete location error!');
  }

  function updateLocSuccess(json) {
  var itemId = json._id;
  for(var i = 0; i < allLocs.length; i++) {
    if(allLocs[i]._id === itemId) {
      allLocs[i].task = json.task;
      allLocs[i].description = json.description;
      console.log(json);
      // break;
      }
    render();
    }
  };

  function updateLocError() {
    console.log('update location error!');
  }
});