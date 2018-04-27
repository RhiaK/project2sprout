$(document).ready(function(){
console.log("yea!");
//signup
	$("#signup-form").on("submit", function(e){
		e.preventDefault();
		  var signupData = {
        email: $("#email-input").val(),
        password: $('#password-input').val(),
        child: $('#childName-input').val(),
        ppphone: $('#ppphone-input').val()
      }
        console.log(signupData);
  	 	$.post('/signup', signupData, function(response){
  		});
	});
//login
	$("#login-form").on("submit", function(e){
		e.preventDefault();
		  var loginData = {
        email: $("#email-input").val(),
        password: $('#password-input').val(),
      }
  			console.log(loginData);
  	 	$.post('/login', loginData, function(response){
  		});

    //signup success function
    function signUpSuccess () {
      window.location.href = '/profile';
    }

    //signup error function
    function signUpError () {
      console.log('Please try again');
    }

    //login success function
    function logInSuccess () {
      window.location.href = '/profile';
    }

    //login error function 
    function logInError () {
      console.log('error logging in, please try again')
    }

});






































});