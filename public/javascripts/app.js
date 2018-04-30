let allLocs = [];

$(document).ready(function(){
console.log("yea!");
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
// //send text message
//   $("#arrived").on("click", function(e){
//     e.preventDefault();
//     //twilio send message
//       let msgData = {
//         name: './models/User.name',
//         loc: './models/User.loc'
//       }
//     $.ajax({
//       method: 'POST',
//       url: '/msg',
//       data: msgData,
//       success: msgSuccess,
//       error: msgError
//     });
//   });


  let $locList = $('#target');
  console.log($locList);

 
  $.ajax({
    method: 'GET', //getting all of the data from database
    url: '/profile/user', //on this url
    success: handleSuccess, //calls handleSuccess on success
    error: handleError //throws error on error
  });

  $(".mbutt").on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'PUT', 
      url: '/profile', 
      data: $('.newLoc').serialize(), 
      success: newLocSuccess,
      error: newLocError
    });
  $('.mbody').modal('toggle');
    return false;
  });

  $locList.on('submit', '#deleteB', function() {
    console.log('clicked delete button to, /loc/' + $(this).attr('data-id'))
    $.ajax({
      method: 'PUT',
      url:'/userRemoveLoc',
      data: {removedLoc: +$(this).attr('data-id')},
      success: deleteLocSuccess,
      error: deleteLocError
    });
  $('.crud').modal('toggle');
    return false;
  });

  $locList.on('submit', '#updateB', function() {
    console.log('clicked update button to,  /loc/'+$(this).attr('data-id'));
    $.ajax({
      method: 'PUT',
      url: '/loc/'+ $(this).attr('data-id'),
      data: $('.newloc').serialize(),
      success: updateLocSuccess,
      error: updateLocError
    });
  $('.crud').modal('toggle');
    return false;
  });

  function getLocHtml(locList) {
  return `<a class="dropdown-item location" data-toggle="modal" data-target=".crud">
            <b>${locList.input}</b>
          </a>`;
  };

  // var getAllLocHtml = allLocs.map (function (loc) {
  //       for (var i = 0; i < item.length; i++) {
  //           new getLoc(item[i]);
  //       };
  // })  
  function getAllLocsHtml(loc) {
    return loc.map(getLocHtml).join("");
  };
  //function to render all locations to view
  function render () {
    $locList.empty();// empty existing posts from view
    var locHtml = getAllLocsHtml(allLocs); // pass allLocs into the template function
    $locList.append(locHtml);// append html to the view
  };

  function handleSuccess(json) {
    console.log(json);
    allLocs = json.loc;//assigning the value of the json object into the empty array
      if (allLocs.length > 0) {
        render();
      } else {
        console.log('needs to add locations');
        $('#target').text('Please add a location');  
      }
  };

  function handleError(e) {
    if (allLocs.length > 0) {
      console.log('uh oh');
      $('#target').text('Failed to load locations');
    } else {
      console.log('needs to add locs');
      $('#target').text('Please add a location');  
    } 
  };

  $("#selectB").on('submit', function(e) {
    e.preventDefault();
      render(location);
    $('.crud').modal('toggle');
      return false;
  });

  $('#arrived').on('submit', function(e) {
    e.preventDefault();
    function msgSuccess(json) {
      render(client.messages)
    }
   }); 

  function msgError(e) {
    console.log("message error");
    alert("Failed to send message");
  };

  function newLocSuccess(json) {
    $('#addlocs').val(''); //clearing the input fields after successful post
      allLocs = json.loc;
      console.log(json.loc); //pushing all data from the array into json
        render();
  };

  function newLocError() {
    console.log('new location error!');
  };

  function deleteLocSuccess(json) {
    var locId = json;
      console.log('delete loc', locId);
    // find the loc with the correct ID and remove it from our allLocs array
    for(var index = 0; index < allLocs.length; index++) {
      if(allLocs[index]._id === locId) {
       allLocs.splice(index, 1);
        break;  
      };
    };
    render();
  };

  function deleteLocError() {
    console.log('delete location error!');
  };

  function updateLocSuccess(json) {
      var itemId = json._id;
    for(var i = 0; i < allLocs.length; i++) {
      if(allLocs[i]._id === itemId) {
        allLocs[i].input = json.input;
        console.log(json);
      // break;
      };
    render();
    };
  };

  function updateLocError() {
    console.log('update location error!');
  };
});