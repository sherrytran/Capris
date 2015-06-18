(function() {
  var UserAccount, UserManagement,
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

  jQuery.validator.addMethod('requirePAEmail', (function(value, element) {
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

  $.validator.addMethod('passwordpolicy', (function(value, element) {
    return this.optional(element) || value.match(/[a-z]/) && value.match(/[0-9]/) && value.match(/[A-Z]/);
  }), 'Password must contain at least one numeric and one upper case and one lower case character.');

  $.validator.addMethod('alphanumeric', (function(value, element) {
    return this.optional(element) || /^\w+$/i.test(value);
  }), 'Letters, numbers, and underscores only .');

  UserManagement = (function() {
    function UserManagement() {
      this.userList = __bind(this.userList, this);
      this.onLoadUser = __bind(this.onLoadUser, this);
      this.locationGroupValue = __bind(this.locationGroupValue, this);
      this.successSignInLoad = __bind(this.successSignInLoad, this);
      this.successCreate = __bind(this.successCreate, this);
      this.signInResult = __bind(this.signInResult, this);
      this.result = __bind(this.result, this);
      this.buildDiv = __bind(this.buildDiv, this);
      this.buildCs = __bind(this.buildCs, this);
      this.buildCdd = __bind(this.buildCdd, this);
      this.buildGroups = __bind(this.buildGroups, this);
      this.validate = __bind(this.validate, this);
      this.fillManagement = __bind(this.fillManagement, this);
      var cred;
      this.signInUsers = [];
      this.dashboardViewUsers = [];
      this.adhocReportViewUsers = [];
      this.adhocReportEditUsers = [];
      cred = cp.credentials;
      this.contents = $("#management-contents");
      this.fillManagement();
      this.onLoadUser(this.userList);
      this.onLoadSignInGroup(this.successSignInLoad);
      this.onCreateGroup(this.buildGroups);
      this.onGetCddCsDiv(this.buildCdd);
      this.userNameArray = [];
    }

    UserManagement.prototype.fillManagement = function() {
      var table, tr1, tr2, tr3, tr4;
      this.form = $("#create-user-form");
      table = $("#first-table");
      tr1 = $("<tr></tr>").appendTo(table);
      $("<td colspan='2'  align='left'><h4>User Profile</h4></td>").appendTo(tr1);
      $("<tr><th>User ID *</th><td><input id='userID' name='userID' class='form-control input-sm' type='text'></td>").appendTo(table);
      $("<tr><th>User Name *</th><td><input id='userName' name='userName' class='form-control input-sm' type='text'></td>").appendTo(table);
      $("<tr><th>Password *</th><td><input id='password' name='password' class='password form-control input-sm' type='password'></td>").appendTo(table);
      $("<tr><th>Confirm Password *</th><td><input id='cpassword' name='cpassword' class='form-control input-sm' type='password'></td>").appendTo(table);
      $("<tr><th>Email </th><td><input id='email' name='email' class='form-control input-sm' type='text'></td>").appendTo(table);
      $("<tr><th>Remark </th><td><input id='remark' name='remark' class='form-control input-sm' type='text'></td>").appendTo(table);
      tr2 = $("<tr></tr>").appendTo(table);
      $("<td colspan='2'  align='left'><h4>Boundary</h4></td>").appendTo(tr2);
      $("<tr><th>Community Development Division (CDD)</th><td><select id='cdd' class='form-control input-sm'><option value='*'>All</option></select></td>").appendTo(table);
      $("<tr><th>Constituency (GRC/SMC)</th><td><select id='grc' class='form-control input-sm'></select></td>").appendTo(table);
      $("<tr><th>Division</th><td><select id='division' class='form-control input-sm'></select></td>").appendTo(table);
      tr3 = $("<tr></tr>").appendTo(table);
      $("<td colspan='2'  align='left'><h4>Role</h4></td>").appendTo(tr3);
      $("<tr><th>Access Group</th><td><select id='access-group' class='form-control input-sm'></select></td>").appendTo(table);
      tr4 = $("<tr></tr>").appendTo(table);
      $("<td colspan='2'  align='left'><h4>Account Setting</h4></td>").appendTo(tr4);
      $("<tr><th>Disable</th><td><input id='disable' type='checkbox'></td>").appendTo(table);
      this.button = $("<button class='btn btn-primary'>Submit</button>").appendTo(table);
      this.button.click((function(_this) {
        return function(e) {
          e.preventDefault();
          if ($(_this.form).valid()) {
            return _this.successCreate();
          }
        };
      })(this));
      $("#cdd").on("change", (function(_this) {
        return function() {
          $("#grc").empty();
          _this.currentCdd = $("#cdd").val();
          return _this.buildCs(_this.currentCdd, _this.CddCsDivData);
        };
      })(this));
      return $("#grc").on("change", (function(_this) {
        return function() {
          $("#division").empty();
          _this.currentCs = $("#grc").val();
          return _this.buildDiv(_this.currentCs, _this.CddCsDivData);
        };
      })(this));
    };

    UserManagement.prototype.validate = function() {
      return $(this.form).validate({
        rules: {
          userID: {
            required: true,
            alphanumeric: true,
            minlength: 3
          },
          userName: {
            required: true
          },
          password: {
            required: true,
            passwordpolicy: true,
            minlength: 8
          },
          cpassword: {
            required: true,
            equalTo: "#password"
          },
          email: {
            required: true,
            email: true,
            requirePAEmail: true
          }
        },
        messages: {
          userID: {
            required: "Please Enter An User ID"
          },
          userName: {
            required: "Please Enter An User Name"
          },
          password: {
            required: "Please Enter A Password",
            minlength: "Please Enter Minimum 8 Characters"
          },
          cpassword: {
            required: "Please Enter A Confirmation Password",
            equalTo: "Your Confirmation Password Did Not Match Your Above Password"
          },
          email: {
            required: "Please Enter An Email",
            email: "Please Enter A Valid Email"
          }
        }
      });
    };

    UserManagement.prototype.buildGroups = function(data) {
      return $.each(data, (function(_this) {
        return function(i, val) {
          var groupName;
          groupName = val.name;
          if (groupName.indexOf("cgd") === -1) {
            return $("<option>" + groupName + "</option>").appendTo($('#access-group'));
          }
        };
      })(this));
    };

    UserManagement.prototype.buildCdd = function(data) {
      var cddArray;
      this.CddCsDivData = data;
      cddArray = [];
      $.each($.unique(data), (function(_this) {
        return function(i, val) {
          var cddCode, cddName;
          cddName = val.cdd_name;
          cddCode = val.cdd_code;
          if (cddArray.indexOf(cddCode) === -1) {
            cddArray.push(cddCode);
            return $("<option value='" + cddCode + "'>" + cddName + "</option>").appendTo($('#cdd'));
          }
        };
      })(this));
      return this.buildCs("*", data);
    };

    UserManagement.prototype.buildCs = function(cdd, data) {
      var csArray;
      csArray = [];
      if (cdd === "*") {
        $("<option value='*'>All</option>").appendTo($('#grc'));
      } else {
        $("<option value='*'>All</option>").appendTo($('#grc'));
        $.each(data, (function(_this) {
          return function(i, val) {
            var csCode, csName;
            if (val.cdd_code === cdd) {
              csName = val.capris_cs_name;
              csCode = val.capris_cs_code;
              if (csArray.indexOf(csCode) === -1) {
                csArray.push(csCode);
                return $("<option value='" + csCode + "'>" + csName + "</option>").appendTo($('#grc'));
              }
            }
          };
        })(this));
      }
      this.currentGRC = $("#grc").val();
      return this.buildDiv(this.currentGRC, data);
    };

    UserManagement.prototype.buildDiv = function(cs, data) {
      $("#division").empty();
      if (cs === "*") {
        return $("<option value='*'>All</option>").appendTo($('#division'));
      } else {
        $("<option value='*'>All</option>").appendTo($('#division'));
        return $.each(data, (function(_this) {
          return function(i, val) {
            var divCode, divName;
            if (val.capris_cs_code === cs) {
              divName = val.div_name;
              divCode = val.div_code;
              return $("<option value='" + divCode + "'>" + divName + "</option>").appendTo($('#division'));
            }
          };
        })(this));
      }
    };

    UserManagement.prototype.result = function() {
      var username;
      username = $('#userID').val();
      this.onSaveUserFunction("SignIn", this.signInUsers, this.signInResult);
      this.onSaveUserFunction("AdhocDashboardView", this.dashboardViewUsers, this.signInResult);
      this.onSaveUserFunction("AdhocReportView", this.adhocReportViewUsers, this.signInResult);
      this.onSaveUserFunction("AdhocReportEdit", this.adhocReportEditUsers, this.signInResult);
      this.userNameArray.push(username);
      return alert("Create User Successfully");
    };

    UserManagement.prototype.signInResult = function() {
      return console.info("enable sign in");
    };

    UserManagement.prototype.onSaveUserFunction = function(functionName, array, andThen) {
      var postURL, username;
      username = $('#userID').val();
      array.push(username);
      postURL = cp.buildSafeUrl("ad/usergroupdb/function/" + functionName);
      return $.ajax({
        type: 'post',
        url: postURL,
        contentType: 'application/json',
        data: JSON.stringify(array),
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

    UserManagement.prototype.successCreate = function() {
      var checked, i, username, _i, _len, _ref;
      checked = 0;
      username = $('#userID').val();
      _ref = this.userNameArray;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i === username) {
          alert("User Name has already existed");
          checked = 1;
          break;
        }
      }
      if (checked !== 1) {
        return this.onCreate(this.result);
      }
    };

    UserManagement.prototype.successSignInLoad = function(data) {
      return $.each(data, (function(_this) {
        return function(i, val) {
          var name;
          name = val.name;
          if (name === "SignIn") {
            _this.signInUsers = val.users;
          }
          if (name === "AdhocDashboardView") {
            _this.dashboardViewUsers = val.users;
          }
          if (name === "AdhocReportView") {
            _this.adhocReportViewUsers = val.users;
          }
          if (name === "AdhocReportEdit") {
            return _this.adhocReportViewUsers = val.users;
          }
        };
      })(this));
    };

    UserManagement.prototype.onLoadSignInGroup = function(andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/ad/usergroupdb/function");
      return $.ajax({
        type: 'get',
        url: postURL,
        dataType: 'json',
        success: andThen,
        error: (function(_this) {
          return function(jqXHR, textStatus, errorThrown) {
            console.info(textStatus);
            console.info(jqXHR.responseText);
            return console.info(errorThrown);
          };
        })(this)
      });
    };

    UserManagement.prototype.onCreateGroup = function(andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/ad/usergroupdb/group");
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

    UserManagement.prototype.locationGroupValue = function() {
      var cdd, cs, div, group, preString;
      preString = "cgd-";
      cdd = $("#cdd").val();
      cs = $("#grc").val();
      div = $("#division").val();
      if (cdd === "*") {
        group = preString + cdd;
      } else {
        if (cs === "*") {
          group = preString + cdd + "-" + cs;
        } else {
          group = preString + cdd + "-" + cs + "-" + div;
        }
      }
      return group;
    };

    UserManagement.prototype.onCreate = function(andThen) {
      var accessGroup, disabled, email, extra, groups, items, locationGroup, password, postURL, username;
      groups = [];
      locationGroup = this.locationGroupValue();
      accessGroup = $("#access-group").val();
      groups.push(locationGroup);
      groups.push(accessGroup);
      extra = {
        Remark: null,
        userID: null
      };
      username = $('#userID').val();
      extra.userID = $('#userName').val();
      extra.Remark = $('#remark').val();
      password = $('#password').val();
      email = $('#email').val();
      disabled = $("#disable").is(':checked');
      if (disabled === true) {
        disabled = false;
      } else {
        disabled = true;
      }
      items = new cp.UserAccount(false, true, email, disabled, extra, groups, username, password);
      postURL = cp.buildSafeUrl("/ad/usergroupdb/user");
      return $.ajax({
        type: 'post',
        url: postURL,
        contentType: 'application/json',
        data: JSON.stringify(items),
        success: andThen,
        error: (function(_this) {
          return function(jqXHR, textStatus, errorThrown) {
            return alert(jqXHR.responseText);
          };
        })(this)
      });
    };

    UserManagement.prototype.onGetCddCsDiv = function(andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/adhoc/web/get/c-cdd-cs-div");
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

    UserManagement.prototype.onLoadUser = function(andThen) {
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

    UserManagement.prototype.userList = function(data) {
      return $.each(data, (function(_this) {
        return function(i, val) {
          var username;
          username = val.name;
          return _this.userNameArray.push(username);
        };
      })(this));
    };

    return UserManagement;

  })();

  UserAccount = (function() {
    function UserAccount(admin, changePassword, email, enabled, extraFields, groups, name, password) {
      this.admin = admin;
      this.changePassword = changePassword;
      this.email = email;
      this.enabled = enabled;
      this.extraFields = extraFields;
      this.groups = groups;
      this.name = name;
      this.password = password;
    }

    return UserAccount;

  })();

  cp.UserAccount = UserAccount;

  cp.UserManagement = UserManagement;

}).call(this);
