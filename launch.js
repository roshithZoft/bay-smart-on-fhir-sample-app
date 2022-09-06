function getFhirData() {
    const clientId = document.querySelector('input').value;
    console.log(clientId);
    FHIR.oauth2.authorize({
      'client_id': clientId,
      'scope': 'user/Patient.read user/Practitioner.read launch openid profile offline_access fhirUser',
      'redirect_uri': 'https://SMART-on-FHIRgithubio.abhishekkini.repl.co/app.html'
    });
  }
  