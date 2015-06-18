(function() {
  var UserEdit, UserEmail, UserPassword,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  cp.buildSafeUrl = function(path, query) {
    var part, parts, sb, _i, _len;
    sb = "/cpr";
    parts = path.split("/");
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      if (part.length > 0) {
        sb += "/" + encodeURIComponent(part);
      }
    }
    return sb + (query || "");
  };

  jQuery.validator.addMethod('requireGmailEmail', (function(value, element) {
    var re;
    re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    if (re.test(value)) {
      if (value.indexOf('@pa.gov.sg', value.length - '@pa.gov.sg'.length) !== -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }), 'Your email address must have @pa.gov.sg');

  jQuery.validator.addMethod('notEqual', (function(value, element, param) {
    return this.optional(element) || value !== $(param).val();
  }), 'Your New Password can not be same as your old password');

  $.validator.addMethod('passwordpolicy', (function(value, element) {
    return this.optional(element) || value.match(/[a-z]/) && value.match(/[0-9]/) && value.match(/[A-Z]/);
  }), 'Password must contain at least one numeric and one upper case and one lower case character.');

  UserEdit = (function() {
    function UserEdit() {
      this.validatePassForm = __bind(this.validatePassForm, this);
      this.validateEmailForm = __bind(this.validateEmailForm, this);
      this.fillManagement = __bind(this.fillManagement, this);
      this.checkedValue = [];
      this.cred = cp.credentials;
      this.UserArray = [];
      this.contents = $("#edit-contents");
      this.fillManagement();
    }

    UserEdit.prototype.fillManagement = function() {
      var tr1, tr2;
      this.table1 = $("#password-table");
      this.table2 = $("#email-table");
      this.form1 = $("#password-form");
      this.form2 = $("#email-form");
      tr1 = $("<tr></tr>").appendTo(this.table1);
      $("<td colspan='2'  align='left'><h4>Password Setting</h4></td>").appendTo(tr1);
      $("<tr><th>Old Password *</th><td><input id='oldPass' name='oldPass' class='form-control input-sm' type='password'></td>").appendTo(this.table1);
      $("<tr><th>New Password *</th><td><input id='newPass' name='password' class='form-control input-sm' type='password'></td>").appendTo(this.table1);
      $("<tr><th>Confirm Password *</th><td><input id='conPass' name='conPass' class='password form-control input-sm' type='password'><div class='password-meter'><div class='password-meter-message> </div><div class='password-meter-bg'><div class='password-meter-bar'></div></div></div></td>").appendTo(this.table1);
      this.button1 = $("<button class='btn btn-primary'>Save</button>").appendTo(this.table1);
      tr2 = $("<tr></tr>").appendTo(this.table2);
      $("<td colspan='2'  align='left'><h4>Email Setting</h4></td>").appendTo(tr2);
      $("<tr><th>Password *</th><td><input id='cpassword' name='cpassword' class='form-control input-sm' type='password'></td>").appendTo(this.table2);
      $("<tr><th>Email </th><td><input id='newEmail' name='newEmail' class='form-control input-sm' type='text'></td>").appendTo(this.table2);
      this.button2 = $("<button class='btn btn-primary'>Save</button>").appendTo(this.table2);
      $("#newEmail").val(elx.parameters.email);
      this.button1.click((function(_this) {
        return function(e) {
          var item, name, newPassword, oldPassword;
          e.preventDefault();
          name = _this.cred.username;
          if ($(_this.form1).valid()) {
            oldPassword = $("#oldPass").val();
            newPassword = $("#newPass").val();
            item = new UserPassword(name, newPassword, oldPassword);
            return _this.onSave(item, "user-password", _this.savePassSuccess);
          }
        };
      })(this));
      return this.button2.click((function(_this) {
        return function(e) {
          var item2, name, newEmail, pass;
          e.preventDefault();
          name = _this.cred.username;
          if ($(_this.form2).valid()) {
            pass = $("#cpassword").val();
            newEmail = $("#newEmail").val();
            item2 = new UserEmail(name, newEmail, pass);
            return _this.onSave(item2, "user-email", _this.saveEmailSuccess);
          }
        };
      })(this));
    };

    UserEdit.prototype.validateEmailForm = function() {
      return $(this.form2).validate({
        rules: {
          cpassword: {
            required: true
          },
          newEmail: {
            required: true,
            requireGmailEmail: true
          }
        },
        messages: {
          cpassword: {
            required: "Need To Provide Your Current Password"
          },
          newEmail: {
            required: "You Need To Enter An Email"
          }
        }
      });
    };

    UserEdit.prototype.validatePassForm = function() {
      return $(this.form1).validate({
        rules: {
          oldPass: {
            required: true
          },
          password: {
            required: true,
            passwordpolicy: true,
            minlength: 8,
            notEqual: "#oldPass"
          },
          conPass: {
            required: true,
            equalTo: "#newPass"
          }
        },
        messages: {
          oldPass: {
            required: "Please Enter Your Old Password"
          },
          password: {
            required: "Please Enter A New Password"
          },
          conPass: {
            required: "Please Enter A Confirmation Password",
            equalTo: "Your Confirmation Password Did Not Match Your Above Password"
          }
        }
      });
    };

    UserEdit.prototype.onSave = function(item, type, andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/ad/usergroupdb/" + type);
      return $.ajax({
        type: 'put',
        url: postURL,
        contentType: 'application/json',
        data: JSON.stringify(item),
        success: andThen,
        error: (function(_this) {
          return function(jqXHR, textStatus, errorThrown) {
            return alert(jqXHR.responseText);
          };
        })(this)
      });
    };

    UserEdit.prototype.onLoadUser = function(andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/ad/usergroupdb/user");
      return $.ajax({
        type: 'get',
        url: postURL,
        dataType: 'json',
        success: andThen,
        error: (function(_this) {
          return function(jqXHR, textStatus, errorThrown) {
            console.info(textStatus);
            console.info(jqXHR);
            return console.info(errorThrown);
          };
        })(this)
      });
    };

    UserEdit.prototype.result = function(data) {
      return console.info(data);
    };

    UserEdit.prototype.savePassSuccess = function() {
      return alert("Changed Password Successfully");
    };

    UserEdit.prototype.saveEmailSuccess = function() {
      return alert("Changed Email Successfully");
    };

    return UserEdit;

  })();

  UserPassword = (function() {
    function UserPassword(name, newpass, oldpass) {
      this.name = name;
      this.newpass = newpass;
      this.oldpass = oldpass;
    }

    return UserPassword;

  })();

  UserEmail = (function() {
    function UserEmail(name, newemail, pass) {
      this.name = name;
      this.newemail = newemail;
      this.pass = pass;
    }

    return UserEmail;

  })();

  cp.UserPassword = UserPassword;

  cp.UserEdit = UserEdit;

  cp.UserEmail = UserEmail;

}).call(this);
