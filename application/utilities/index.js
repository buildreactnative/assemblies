export function rowHasChanged(r1, r2){
  return r1 != r2;
}

export function setRegistrationErrorMsg({ email, password, location, firstName, lastName}){
  if (! /@/.test(email)) { return 'Invalid email address'; }
  if (! password.length) { return 'Must set a password.'; }
  if (! location || typeof location !== "object") { return "Must set a valid location."; }
  if (firstName === '') { return 'Must set a first name.' }
  if (lastName === '') { return 'Must set a last name.' }
  return '';
}
