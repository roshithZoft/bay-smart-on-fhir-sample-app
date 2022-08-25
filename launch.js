function getFhirData() {
    const clientId = document.querySelector('input').value;
    console.log(clientId);
    FHIR.oauth2.authorize({
        'client_id': clientId,
        'scope': 'user/Patient.read launch openid profile',
        'redirect_uri': 'https://abhishekskini1317.github.io/SMART-on-FHIR.github.io/app.html'
    });
}
