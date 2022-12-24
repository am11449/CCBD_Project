function getPoolData(){
	return {
			UserPoolId: "us-east-1_9xTgIoeEW",
			ClientId: "41dr2n2jru4ao3fv9n9nqrqcg9"
		};
}

function hideElement(element) {
	 element.style.display = 'none';
		 }

function showElement(element, style) {
	 var displayStyle = style ? style : 'block';
	 element.style.display = displayStyle;
}

		 function clearRegisterResult() {
	 document.querySelector('#register-result').innerHTML = '';
}
		 function showLoadingMessage(msg) {
			 var itemList = document.querySelector('#item-list');
			 itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i> ' +
				 msg + '</p>';
		 }
		 function activeBtn(btnId) {
			 var btns = document.querySelectorAll('.main-nav-btn');

			 // deactivate all navigation buttons
			 for (var i = 0; i < btns.length; i++) {
				 btns[i].className = btns[i].className.replace(/\bactive\b/, '');
			 }

			 // active the one that has id = btnId
			 var btn = document.querySelector('#' + btnId);
			 btn.className += ' active';
		 }

		 function listItems(items) {
			 var itemList = document.querySelector('#item-list');
			 itemList.innerHTML = ''; // clear current results

			 for (var i = 0; i < items.length; i++) {
				 addItem(itemList, items[i]);
			 }
		 }
		 function addItem(itemList, item) {
			 var item_id = item.item_id;

			 // create the <li> tag and specify the id and class attributes
			 var li = $create('li', {
				 id : 'item-' + item_id,
				 className : 'item'
			 });

			 // set the data attribute ex. <li data-item_id="G5vYZ4kxGQVCR"
			 // data-favorite="true">
			 li.dataset.item_id = item_id;
			 li.dataset.favorite = item.favorite;

			 // item image
			 if (item.image_url) {
				 li.appendChild($create('img', {
					 src : item.image_url
				 }));
			 } else {
				 li.appendChild($create('img', {
					 src : 'https://via.placeholder.com/100'
				 }));
			 }
			 // section
			 var section = $create('div');

			 // title
			 var title = $create('a', {
				 className : 'item-name',
				 href : item.url,
				 target : '_blank'
			 });
			 title.innerHTML = item.name;
			 section.appendChild(title);

			 // keyword
			 var keyword = $create('p', {
				 className : 'item-keyword'
			 });
			 keyword.innerHTML = 'Keyword: ' + item.keywords.join(', ');
			 section.appendChild(keyword);

			 li.appendChild(section);

			 // address
			 var address = $create('p', {
				 className : 'item-address'
			 });

			 // ',' => '<br/>', '\"' => ''
			 address.innerHTML = item.address.replace(/,/g, '<br/>').replace(/\"/g, '');
			 li.appendChild(address);

			 // favorite link
			 var favLink = $create('p', {
				 className : 'fav-link'
			 });

			 favLink.onclick = function() {
				 changeFavoriteItem(item);
			 };

			 favLink.appendChild($create('i', {
				 id : 'fav-icon-' + item_id,
				 className : item.favorite ? 'fa fa-heart' : 'fa fa-heart-o'
			 }));

			 li.appendChild(favLink);
			 itemList.appendChild(li);
		 }
		 function $create(tag, options) {
			 var element = document.createElement(tag);
			 for ( var key in options) {
				 if (options.hasOwnProperty(key)) {
					 element[key] = options[key];
				 }
			 }
			 return element;
		 }


		 function showWarningMessage(msg) {
			 var itemList = document.querySelector('#item-list');
			 itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i> '
					 + msg + '</p>';
		 }





			 /**
	* AJAX helper
	* @param method - GET|POST|PUT|DELETE
	* @param url - API end point
	* @param data - request payload data
	* @param successCallback - Successful callback function
	* @param errorCallback - Error callback function
	*/
 function ajax(method, url, data, successCallback, errorCallback) {
	 var xhr = new XMLHttpRequest();

	 xhr.open(method, url, true);

	 xhr.onload = function() {
		 if (xhr.status === 200) {
			 successCallback(xhr.responseText);
		 } else {
			 errorCallback();
		 }
	 };

	 xhr.onerror = function() {
		 console.error("The request couldn't be completed.");
		 errorCallback();
	 };

	 if (data === null) {
		 xhr.send();
	 } else {
		 xhr.setRequestHeader("Content-Type",
			 "application/json;charset=utf-8");
		 xhr.send(data);
	 }
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
	console.log("LOGGED IN!!!!!")
	sessionStorage.setItem('user_id',user_id);

  //  welcomeMsg.innerHTML = 'Welcome, ' +  window.localStorage.getItem('user_id');

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
	function clearLoginError() {
	    document.querySelector('#login-error').innerHTML = '';
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
	console.log("Inside login")
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
