function getPoolData(){
	return {
			UserPoolId: "us-east-1_9xTgIoeEW",
			ClientId: "	41dr2n2jru4ao3fv9n9nqrqcg9"
		};
}

var userPool;
function getUserPool(){
	if (userPool===undefined){
		let poolData = getPoolData()
		console.log(poolData)
		userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	};
	return userPool;
}


var cognitoUser;
var apigClient;

function getUser(userName){
	if (cognitoUser===undefined){
	    var userData = {
	        Username : userName,
	        Pool : getUserPool()
	        };
    	cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	}
	return cognitoUser;
}

function onSessionValid(username) {
  cognito_user = getUser(username)
  window.localStorage.setItem('username', username)
  window.localStorage.setItem('user_id', username.split('@')[0])
  console.log(cognito_user);
    user_id = username;

    welcomeMsg.innerHTML = 'Welcome, ' +  window.localStorage.getItem('user_id');

  /*  showElement(itemNav);
  showElement(innerMainContainer);
    showElement(jobTags, "flex");
  hideElement(jobList);
  hideElement(jobInformation);
    showElement(avatar);
    showElement(welcomeMsg);
    showElement(logoutBtn, 'inline-block');
    hideElement(loginForm);
    hideElement(registerForm);
  hideElement(profileForm);
  hideElement(likedList);
  hideElement(recoList);
*/
//  RecommendedJobsNew();
  }

function onSessionInvalid(){

/*  console.log("Hiding elements");
  hideElement(itemNav);
  hideElement(innerMainContainer);
    hideElement(jobTags);
  hideElement(jobList);
  hideElement(jobInformation);
    hideElement(avatar);
    hideElement(welcomeMsg);
    hideElement(logoutBtn);
    hideElement(loginForm);
    hideElement(registerForm);
  hideElement(profileForm);
*/
    clearLoginError();
  $('#jobWallLeft').empty()
  $('#jobWallRight').empty()
  $('#jobList').empty()
  $('#jobInformation').empty()
  window.localStorage.removeItem('username')
  console.log("Showing login form");
    showElement(loginForm);
}

function validateSession(){

  let stored = window.localStorage.getItem('username')

  if (stored === null)
  {
    onSessionInvalid();
  }
  else
  {
    onSessionValid(stored);
  }
}

loginForm = document.querySelector('#login-form');
document.querySelector('#login-btn').addEventListener('click', login);
validateSession();
function login() {
    var username = document.querySelector('#username').value;
    var password = document.querySelector('#password').value;

  let authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  console.log(authenticationDetails);
    getUser(username).authenticateUser(authenticationDetails,  {
    onSuccess: result => onSessionValid(username),
      onFailure: err => {
      console.log(err);
      document.querySelector('#login-error').innerHTML = "Invalid Login";
    }
  });

  }
