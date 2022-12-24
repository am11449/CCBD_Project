var cognitoUser;
var userPool;


function getPoolData(){
	return {
			UserPoolId: "us-east-1_9xTgIoeEW",
			ClientId: "41dr2n2jru4ao3fv9n9nqrqcg9"
		};
}

function getUserPool(){
	if (userPool===undefined){
		let poolData = getPoolData()
		console.log(poolData)
		userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	};
	return userPool;
}   

function onSessionValid(username) {
    cognito_user = getUser(username)
    window.localStorage.setItem('username', username)
    window.localStorage.setItem('user_id', username.split('@')[0])
    console.log(cognito_user);
    console.log(window.localStorage)
      user_id = username;
    location.href = 'search.html'
}

function getUser(userName){
	if (cognitoUser===undefined){
	    var userData = {
	        Username : userName,
	        Pool : getUserPool()
	        };
        console.log(userData)
    	cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	}
	return cognitoUser;
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
            // clearLoginError();	
        $('#jobWallLeft').empty()
        $('#jobWallRight').empty()
        $('#jobList').empty()
        $('#jobInformation').empty()
        window.localStorage.removeItem('username')
        // console.log("Showing login form");
        // showElement(loginForm);
        // alert("Please Login to view this page")
        // location.href = 'index.html'
}

function validateSession(){

    let stored = window.localStorage.getItem('username')
    console.log(stored)
  
    if (stored === null)
    {
      onSessionInvalid();
    }
    else
    {
      onSessionValid(stored);
    }
}

