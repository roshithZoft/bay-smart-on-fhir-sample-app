function getFhirData() {
    const clientId = document.querySelector('input').value;
    console.log(clientId);
    FHIR.oauth2.authorize({
      'client_id': clientId,
      'scope': 'user/Patient.read user/Practitioner.read launch openid profile offline_access fhirUser',
      'redirect_uri': 'https://roshithzoft.github.io/bay-smart-on-fhir-sample-app/app.html'
    });
  }
  