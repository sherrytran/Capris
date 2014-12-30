(function() {
  var ReportCate;

  ReportCate = (function() {
    function ReportCate() {
      var cred;
      cred = cp.credentials;
      console.info(cred);
      $("a#user").text("Welcome, " + cred.username);
      if (cred.username !== "admin") {
        $("#areportdiv").hide();
        $("#breportdiv").hide();
        $("#areport").hide();
        $("#breport").hide();
        $("#log").hide();
      }
    }

    return ReportCate;

  })();

  $(document).ready(function() {
    return new ReportCate();
  });

}).call(this);
