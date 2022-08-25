var myApp = {}
FHIR.oauth2.ready()
    .then(function (client) {
        myApp.smart = client
        doRequests()
    });

async function doRequests() {
    var obs = await fetch(myApp.smart.state.serverUrl + "/Patient/" + myApp.smart.patient.id, {
        headers: {
            "Accept": "application/json+fhir",
            "Authorization": "Bearer " + myApp.smart.state.tokenResponse.access_token
        }
    }).then(function (data) {
        return data
    });
    var response = await obs.json()
    var firstName = response.name ? (response.name[0].given || 'Nil') : 'Nil';
    var lastName = response.name ? (response.name[0].family || 'Nil') : 'Nil';
    var mobile = response.telecom ? (response.telecom[0].value || 'Nil') : 'Nil';
    var language = response.communication ? (response.communication[0].language.text || 'Nil') : 'Nil';
    var gender = response.gender || 'Nil';
    var DOB = response.birthDate || 'Nil';
    var address = response.contact ? (response.contact[0].address ? JSON.stringify(response.contact[0].address) : 'Nil') : 'Nil';

    $("#lastName").html(lastName)
    $("#firstName").html(firstName)
    $("#mobile").html(mobile)
    $("#language").html(language)
    $("#gender").html(gender)
    $("#DOB").html(DOB)
    $("#address").html(address)
}