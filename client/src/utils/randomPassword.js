const randomPassword = (length = 10) => {
  var chars =
    'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
  var pass = '';
  for (var x = 0; x < length; x++) {
    var i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return pass;
};

export default randomPassword;
