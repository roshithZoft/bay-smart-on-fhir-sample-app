var myApp = {}
var decodedToken;
FHIR.oauth2.ready()
  .then(function(client) {
    myApp.smart = client
    tokenDisplay();
    patientRequests();
  })
  .then(() => {
    userRequests(decodedToken.fhirUser);
  })
  .catch(() => {
    console.log("Error")
  }
  )

async function patientRequests() {
  var patientDetails = await fetch(myApp.smart.state.serverUrl + "/Patient/" + myApp.smart.patient.id, {
    headers: {
      "Accept": "application/json+fhir",
      "Authorization": "Bearer " + myApp.smart.state.tokenResponse.access_token
    }
  }).then(function(data) {
    return data
  });
  
  var patientResponse = await patientDetails.json()
  var formattedPatientResponse = formatedJson(patientResponse);
  document.getElementById('patientJson').innerHTML = formattedPatientResponse;
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
}

async function userRequests(fhirUserUrl) {
  var userDetails = await fetch(fhirUserUrl, {
    headers: {
      "Accept": "application/json+fhir",
      "Authorization": "Bearer " + myApp.smart.state.tokenResponse.access_token
    }
  }).then(function(data) {
    return data
  });
  var userResponse = await userDetails.json();
  var formattedUserResponse = formatedJson(userResponse);
  document.getElementById('userJson').innerHTML = formattedUserResponse;

  console.log(userResponse);

  var firstName = userResponse.name ? (userResponse.name[0].given || 'Nil') : 'Nil';
  var lastName = userResponse.name ? (userResponse.name[0].family || 'Nil') : 'Nil';
  var id = userResponse.id;

  $("#ulastName").html(lastName)
  $("#ufirstName").html(firstName)
  $("#uid").html(id)
}

async function tokenDisplay() {

  var token = myApp.smart.state.tokenResponse.id_token;
  decodedToken = parseJwt(JSON.stringify(token));
  console.log(decodedToken.fhirUser)
  var tokenResponse = formatedJson(myApp.smart.state.tokenResponse)
  var formatteddeocoededToken = formatedJson(decodedToken)
  var refreshToken = JSON.stringify(myApp.smart.state.tokenResponse.refresh_token);



  document.getElementById('tokenResponse').innerHTML = tokenResponse;
  document.getElementById('decodedId').innerHTML = formatteddeocoededToken;
  $('#refreshToken').html(refreshToken)

}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

function formatedJson(jsonValue, margin = 24) {
  // let formattedJSONString = Object.entries(jsonValue)
  //   .reduce((acc, [key, value]) => `${acc}
  //   <span class='json-key'>"${key}": </span>
  //   <span class='value'>"${value}"</span>,<br/>`,
  //     `{<br/>`) + `}`;
  // return formattedJSONString;

  var formattedJson = '';
  Object.entries(jsonValue).forEach(([key, value]) => {
    formattedJson += `<span style='margin-left:${margin}px;' class='json-key'>"${key}"</span><span class="syntax" ${this.scope}>:</span>`
    if (typeof value == "object") {
      formattedJson += `<span class='syntax'>{</span><br/>`
      formattedJson += this.formatedJson(value, margin + 12)
      formattedJson += `<br/><span style='margin-left:${margin}px;' class='syntax'>}</span>`
    } else {
      if (Object.keys(jsonValue).reverse()[0] != key) formattedJson += `<span class='value'>"${value}"</span><span class="syntax">,</span><br/>`
      else
        formattedJson += `<span class='value'>"${value}"</span>`
    }
  })

  return formattedJson;

}
