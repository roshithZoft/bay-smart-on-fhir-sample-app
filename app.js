var myApp = {}
FHIR.oauth2.ready()
  .then(function(client) {
    myApp.smart = client
    patientRequests()
    if(myApp.smart.user.fhirUser !== undefined)
    {
      console.log("before userRequest() method")
      userRequests();
    }
    displayToken(myApp.smart.state.tokenResponse)
  });

async function patientRequests() {
  var patientDetails = await fetch(myApp.smart.state.serverUrl + "/Patient/" + myApp.smart.patient.id, {
    headers: {
      "Accept": "application/json+fhir",
      "Authorization": "Bearer " + myApp.smart.state.tokenResponse.access_token
    }
  }).then(function(data) {
    //userRequests(myApp.smart)
    return data
  });

  var patientResponse = await patientDetails.json()
  console.log(patientResponse)

  var firstName = patientResponse.name ? (patientResponse.name[0].given || 'Nil') : 'Nil';
  var lastName = patientResponse.name ? (patientResponse.name[0].family || 'Nil') : 'Nil';
  var mobile = patientResponse.telecom ? (patientResponse.telecom[0].value || 'Nil') : 'Nil';
  var language = patientResponse.communication ? (patientResponse.communication[0].language.text || 'Nil') : 'Nil';
  var gender = patientResponse.gender || 'Nil';
  var DOB = patientResponse.birthDate || 'Nil';
  var address = patientResponse.contact ? (patientResponse.contact[0].address ? JSON.stringify(patientResponse.contact[0].address, null, "\t") : 'Nil') : 'Nil';

  $("#lastName").html(lastName)
  $("#firstName").html(firstName)
  $("#mobile").html(mobile)
  $("#language").html(language)
  $("#gender").html(gender)
  $("#DOB").html(DOB)
  $("#address").html(address)

  console.log(myApp.smart)
  console.log(myApp.smart.fhirUser)
}

async function userRequests() {

    var userDetails = await fetch(myApp.smart.user.fhirUser, {
    headers: {
      "Accept": "application/json+fhir",
      "Authorization": "Bearer " + myApp.smart.state.tokenResponse.access_token
    }
  }).then(function(data) {
    return data
  });

  var userResponse = await userDetails.json()
  console.log(userResponse)
  
  var firstName = userResponse.name ? (userResponse.name[0].given || 'Nil') : 'Nil';
  var lastName = userResponse.name ? (userResponse.name[0].family || 'Nil') : 'Nil';
  var id = userResponse.id || 'Nil';
  
  var tokenResponse = JSON.stringify(myApp.smart.state.tokenResponse, null, "\t");
  var idToken = myApp.smart.state.tokenResponse.id_token;


  var decodedToken = parseJwt(JSON.stringify(idToken));
  console.log(decodedToken)

  var decodedIdTokenUsingLibrary=jwt_decode(idToken);
  console.log(decodedIdTokenUsingLibrary)

  $("#ulastName").html(lastName)
  $("#ufirstName").html(firstName)
  $("#uid").html(id)

  $('#tokenResponse').html(tokenResponse)
  $('#decodedId').html(JSON.stringify(decodedToken, null, "\t"))
  console.log(JSON.stringify(myApp.smart, null, "\t"))

}

function displayToken(token){
    var tokenResponse = JSON.stringify(token, null, "\t");
    var idToken = tokenResponse.id_token;
    var refreshToken=tokenResponse.refreshToken;
  
    // var decodedToken = parseJwt(JSON.stringify(idToken));
    // console.log(decodedToken)
  
    var decodedIdTokenUsingLibrary=jwt_decode(idToken);
    console.log(decodedIdTokenUsingLibrary)

    $('#tokenResponse').html(tokenResponse)
    $('#decodedId').html(JSON.stringify(decodedIdTokenUsingLibrary, null, "\t"))
    $('#refreshToken').html(refreshToken)
};

function parseJwt(token) {
  // const base64HeaderUrl = token.split('.')[0];
  // const base64Header = base64HeaderUrl.replace(/-/g, '+').replace(/_/g, '/');
  // const headerData = decodeURIComponent(window.atob(base64Header).split('').map(function(c) {
  //   return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  // }).join(''));
 
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  //jsonPayload.header = headerData;
  return JSON.parse(jsonPayload);
};


// function parseJwt(token) {
//   try {
//     return JSON.parse(atob(token.split('.')[1]));
//   } catch (e) {
//     return null;
//   }
// };
// async function userRequests(client) {
//   var userDetails = await fetch(client.user.fhirUser, {
//     headers: {
//       "Accept": "application/json+fhir",
//       "Authorization": "Bearer " + client.state.tokenResponse.access_token
//     }
//   }).then(function(data) {
//     return data
//   });
//   var userResponse = await userDetails.json()
//   console.log(userResponse)
//   var firstName = userResponse.name ? (userResponse.name[0].given || 'Nil') : 'Nil';
//   var lastName = userResponse.name ? (userResponse.name[0].family || 'Nil') : 'Nil';
//   var id = userResponse.id || 'Nil';
//   var tokenResponse = JSON.stringify(client.state.tokenResponse, null, "\t");

//   $("#ulastName").html(lastName)
//   $("#ufirstName").html(firstName)
//   $("#uid").html(id)
//   $('#tokenResponse').html(tokenResponse)
//   console.log(client)

// }