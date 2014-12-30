(function() {
  var LoginLogout;

  LoginLogout = (function() {
    function LoginLogout() {
      var logout;
      logout = $("#logout");
      logout.click(function(ev) {
        $("#logoff-form").submit();
        return false;
      });
    }

    return LoginLogout;

  })();

  $(document).ready(function() {
    return new LoginLogout();
  });

}).call(this);
