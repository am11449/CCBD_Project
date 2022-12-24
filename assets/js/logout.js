

document.querySelector('#logout-link').addEventListener('click', onSessionInvalid);


function onSessionInvalid(){

    // console.log("Hiding elements");
    // hideElement(itemNav);
    // hideElement(innerMainContainer);
    // // hideElement(jobTags);
    // hideElement(jobList);
    // hideElement(jobInformation);
    // hideElement(avatar);
    // hideElement(welcomeMsg);
    // hideElement(logoutBtn);
    // hideElement(loginForm);
    // hideElement(registerForm);
    // hideElement(profileForm);

    // clearLoginError();
    // alertLoginError();
    $('#jobWallLeft').empty()
    $('#jobWallRight').empty()
    $('#jobList').empty()
    $('#jobInformation').empty()
    window.localStorage.removeItem('username')
    window.localStorage.removeItem('user_id')
    console.log(sessionStorage);
    sessionStorage.clear()
    console.log(sessionStorage);
    console.log("Showing login form");
    // showElement(loginForm);
    location.href = 'index.html'
}


