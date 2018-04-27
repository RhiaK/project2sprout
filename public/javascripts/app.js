console.log("yea!");

$(document).ready(function(){
//signup
	$("#signup-form").on("submit", function(e){
		e.preventDefault();
		  var signupData = $("#signup-form").serialize();
  			console.log(signupData);
  	 	$.post('/users', signupData, function(response){
    	console.log(response);
  		});
	});
//login
	$("#login-form").on("submit", function(e){
		e.preventDefault();
		  var loginData = $("#login-form").serialize();
  			console.log(loginData);
  	 	$.post('/login', loginData, function(response){
    	console.log(response);
  		});

});






































});