function getPoolData(){
	return {
			UserPoolId: "us-east-1_9xTgIoeEW",
			ClientId: "41dr2n2jru4ao3fv9n9nqrqcg9"
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

var registerForm;
var profileForm;
var username;

document.querySelector('#register-btn').addEventListener('click', register);

profileForm = document.querySelector('#profile-form');
registerForm = document.querySelector('#register-form');
document.querySelector('#update-profile-btn').addEventListener('click', updateProfile);

apigClient = apigClientFactory.newClient({});

hideElement(profileForm);

function showProfileResult(registerMessage) {
    document.querySelector('#profile-result').innerHTML = registerMessage;
}

function showRegisterResult(registerMessage) {
    document.querySelector('#register-result').innerHTML = registerMessage;
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
      // let encoded = reader.result.toString();
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}

function uploadResumeToS3()
	{
		let file = document.getElementById('resume-file-input').files[0];
		if (file == undefined)
		{
	        return;
	    }

		let blob = file.slice(0, file.size, file.type);

    var file_name = username.split('@')[0] 

		let newFile = new File([blob], file_name +'.jpeg', {type: 'image/jpeg'});

		let labels = [file_name]


		let fl = getBase64(newFile).then(
			data => {

		        let body = data;
		        let params = {"file" : newFile.name, 'Content-Type': newFile.type, 'x-amz-meta-customLabels': labels, 'folder': 'linkedout-resumestore2'};
		        let additionalParams = {};

				console.log(body);
				console.log(params);

                console.log("Base64 Success")
		        apigClient.postresumeFolderFilePut(params, body , additionalParams).then(function(res){
		        	if (res.status == 200) {
						console.log("upload success");
		            	createProfileView()
		        	}
		      	}).catch(function(res) {
                    console.log("Upload Failed")
					console.log(res);
				})
	    	})

	}

function register() {
    hideElement(registerForm);
    showElement(profileForm);
    username = document.querySelector('#register-username').value;
    var password = document.querySelector('#register-password').value;
    console.log(username)
    console.log(password)
    console.log("Called!")
    if (!username || !password) {
        showRegisterResult('Please fill in all fields');
        return
      }

      
        let dataEmail = {
            Name : 'email',
            Value : username
        }

        let attributeList = [ new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)]

        let userPool = getUserPool();
        console.log("User Pool")
        console.log(userPool);

        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
              showRegisterResult('Failed to register');
            }
            else {
              cognitoUser = result.user;
            console.log(cognitoUser);
           // uploadResumeToS3()
          //  showProfileForm()
              //showRegisterResult('Succesfully registered');
            }
        });
        }

function updateProfile() {
    let verif_code = document.querySelector('#profile-verif-code').value;
    var fname = document.querySelector('#profile-firstname').value;
    var lname = document.querySelector('#profile-lastname').value;
    var major = document.querySelector('#profile-major').value;
    var highestDeg = document.querySelector('#profile-highest-deg').value;
    let grad_year = document.querySelector('#profile-grad-year').value;
    let skills_str = document.querySelector('#profile-skills-list').value;
    let int_roles_str = document.querySelector('#profile-int-roles').value;

    let db_username = username.split("@")[0]
    let int_roles = int_roles_str.split(",")
    let skills_inp = skills_str.split(",")

    let reqBody = {
        'user_id': db_username,
        'highest_deg': highestDeg,
        'first_name': fname,
        'last_name': lname,
        'degree': major,
        'year_of_grad': grad_year,
        'interested_roles': int_roles,
        'skills_input': skills_inp,
        'skills_textract':[]
    }

    let params = { }

    let additionalParams = {
        headers: {
            'Content-Type':"application/json"
        }
    }
    console.log(reqBody);
    console.log(verif_code);

    getUser(cognitoUser['username']).confirmRegistration(verif_code, true, function(err, verres) {
      if (err)
      {
        showProfileResult("Failed to verify")
        console.log(err);
      }
      else
      {
        apigClient.createuserPost(params, reqBody, additionalParams).then(function(result)
          {
              console.log(result);
              showProfileResult('Succesfully registered');
          }).catch(function(res) {
              console.log(res);
              showProfileResult('Failed to register');
          })
      }
    })

  }
