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
//send text message
  $("#arrived").on("submit", function(e){
    e.preventDefault();
    //twilio send message
      let msgData = {
        name: './models/user/name',
        loc: './models/user/loc'
      }
    $.ajax({
      method: 'POST',
      url: '/msg',
      data: msgData,
      success: msgSuccess,
      error: msgError
      });

  })


});