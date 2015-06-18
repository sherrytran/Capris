(function() {
  var UserAccount, UserAccountNoPass, UserEdit,
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

  UserEdit = (function() {
    function UserEdit() {
      this.resultUserInfo = __bind(this.resultUserInfo, this);
      this.locationGroupValue = __bind(this.locationGroupValue, this);
      this.successSave = __bind(this.successSave, this);
      this.result = __bind(this.result, this);
      this.buildDiv = __bind(this.buildDiv, this);
      this.buildCs = __bind(this.buildCs, this);
      this.buildCdd = __bind(this.buildCdd, this);
      this.buildGroups = __bind(this.buildGroups, this);
      this.assignGroup = __bind(this.assignGroup, this);
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
      this.onCreateGroup(this.buildGroups);
      this.onGetCddCsDiv(this.buildCdd);
      this.onLoadUser(this.resultUserInfo);
    }

    UserEdit.prototype.fillManagement = function() {
      var tr1, tr2, tr3, tr4;
      this.form = $("#edit-user-form");
      this.table1 = $("#first-table");
      this.table2 = $("#second-table");
      tr1 = $("<tr></tr>").appendTo(this.table2);
      $("<td colspan='2'  align='left'><h4>User Profile</h4></td>").appendTo(tr1);
      $("<tr><th>User ID *</th><td><input id='userID' name='userID' class='form-control input-sm' type='text' readonly></td><td></td>").appendTo(this.table2);
      $("<tr><th>User Name *</th><td><input id='userName' name='userName' class='form-control input-sm' type='text'></td><td></td>").appendTo(this.table2);
      $("<tr><th>Password </th><td><input id='password' name='password' class='form-control input-sm' type='password'></td><td>(please leave it blank if you don't want to change the password)</td>").appendTo(this.table2);
      $("<tr><th>Confirm Password </th><td><input id='cpassword' name='cpassword' class='form-control input-sm' type='password'></td><td></td>").appendTo(this.table2);
      $("<tr><th>Email </th><td><input id='email' name='email' class='form-control input-sm' type='text'></td><td></td>").appendTo(this.table2);
      $("<tr><th>Remark </th><td><input id='remark' name='remark' class='form-control input-sm' type='text'></td><td></td>").appendTo(this.table2);
      tr2 = $("<tr></tr>").appendTo(this.table2);
      $("<td colspan='2'  align='left'><h4>Boundary</h4></td><td></td>").appendTo(tr2);
      $("<tr><th>Community Development Division (CDD)</th><td><select id='cdd' class='form-control input-sm'><option value='*'>All</option></select></td><td></td>").appendTo(this.table2);
      $("<tr><th>Constituency (GRC/SMC)</th><td><select id='grc' class='form-control input-sm'></select></td><td></td>").appendTo(this.table2);
      $("<tr><th>Division</th><td><select id='division' class='form-control input-sm'></select></td><td></td>").appendTo(this.table2);
      tr3 = $("<tr></tr>").appendTo(this.table2);
      $("<td colspan='2'  align='left'><h4>Role</h4></td>").appendTo(tr3);
      $("<tr><th>Access Group</th><td><select id='access-group' class='form-control input-sm'></select></td><td><a href='/cpr/group-config.html'>Group Configuration</a></td>").appendTo(this.table2);
      tr4 = $("<tr></tr>").appendTo(this.table2);
      $("<td colspan='2'  align='left'><h4>Account Setting</h4></td><td></td>").appendTo(tr4);
      $("<tr><th>Disable</th><td><input id='disable' type='checkbox'></td><td></td>").appendTo(this.table2);
      this.button = $("<button class='btn btn-primary'>Save Changes</button>").appendTo(this.table2);
      $(this.table1).on("click", "tr td:first-child", (function(_this) {
        return function(e) {
          var selectedName;
          selectedName = $(e.target).text();
          return $.each(_this.UserArray, function(i, val) {
            var email, enable, groups, id, remark, userName;
            userName = val.name;
            if (userName === selectedName) {
              if (val.extraFields) {
                id = val.extraFields.userID;
                remark = val.extraFields.Remark;
              } else {
                id = "";
                remark = "";
              }
              email = val.email;
              groups = val.groups;
              enable = val.enabled;
              $("#userID").val(selectedName);
              $("#userName").val(id);
              $("#email").val(email);
              $("#remark").val(remark);
              _this.assignGroup(groups);
              if (enable) {
                $("#disable").prop('checked', false);
              } else {
                $("#disable").prop('checked', true);
              }
              return false;
            }
          });
        };
      })(this));
      this.button.click((function(_this) {
        return function(e) {
          e.preventDefault();
          if ($(_this.form).valid()) {
            return _this.successSave();
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

    UserEdit.prototype.validate = function() {
      return $(this.form).validate({
        rules: {
          userID: {
            required: true
          },
          userName: {
            required: true
          },
          password: {
            passwordpolicy: {
              depends: function(element) {
                return $('#password').val().length > 0;
              }
            },
            minlength: function() {
              if ($('#password').val().length > 0) {
                return 8;
              }
            }
          },
          cpassword: {
            required: {
              depends: function(element) {
                return $('#password').val().length > 0;
              }
            },
            equalTo: "#password"
          },
          email: {
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
          cpassword: {
            required: "Please Enter A Confirmation Password",
            equalTo: "Your Confirmation Password Did Not Match Your Above Password"
          },
          email: {
            email: "Please Enter A Valid Email"
          }
        }
      });
    };

    UserEdit.prototype.assignGroup = function(c) {
      return $.each(c, (function(_this) {
        return function(i, value) {
          var parts;
          if (value.indexOf("cgd") !== -1) {
            parts = value.split("-");
            $('#cdd').val(parts[1]);
            $('#cdd').change();
            if (parts[1] === "*") {
              $('#grc').val("*");
              return $('#division').val("*");
            } else {
              $('#grc').val(parts[2]);
              $('#grc').change();
              if (parts[2] === "*") {
                return $('#division').val("*");
              } else {
                return $('#division').val(parts[3]);
              }
            }
          } else {
            return $('#access-group').val(value);
          }
        };
      })(this));
    };

    UserEdit.prototype.buildGroups = function(data) {
      return $.each(data, (function(_this) {
        return function(i, val) {
          var groupName;
          groupName = val.name;
          if (groupName.indexOf("cgd") === -1) {
            return $("<option value='" + groupName + "'>" + groupName + "</option>").appendTo($('#access-group'));
          }
        };
      })(this));
    };

    UserEdit.prototype.buildCdd = function(data) {
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

    UserEdit.prototype.buildCs = function(cdd, data) {
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

    UserEdit.prototype.buildDiv = function(cs, data) {
      $("#division").empty();
      if (cdd === "*") {
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

    UserEdit.prototype.result = function() {
      this.onLoadUser(this.resultUserInfo);
      return alert("Changed User Profile Successfully");
    };

    UserEdit.prototype.successSave = function() {
      var userid;
      userid = $("#userID").val();
      return this.onSave(userid, this.result);
    };

    UserEdit.prototype.onCreateGroup = function(andThen) {
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

    UserEdit.prototype.locationGroupValue = function() {
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

    UserEdit.prototype.onSave = function(userid, andThen) {
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
      if (password.length > 0) {
        items = new cp.UserAccount(username, false, disabled, true, groups, email, extra, password);
      } else {
        items = new cp.UserAccountNoPass(username, false, disabled, true, groups, email, extra);
      }
      postURL = cp.buildSafeUrl("/ad/usergroupdb/user/" + userid);
      return $.ajax({
        type: 'put',
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

    UserEdit.prototype.onGetCddCsDiv = function(andThen) {
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

    UserEdit.prototype.resultUserInfo = function(data) {
      var tr;
      this.UserArray = data;
      this.table1.empty();
      tr = $("<tr></tr>").appendTo(this.table1);
      $("<td colspan='2'  align='left'><h4>User Account</h4></td>").appendTo(tr);
      $("<tr><td>User ID</td><td>User Name</td></tr>").appendTo($(this.table1));
      return $.each(data, (function(_this) {
        return function(i, val) {
          var extra, isAdmin, userID, userName;
          userName = val.name;
          extra = val.extraFields;
          if (extra) {
            userID = extra.userID;
            if (!userID) {
              userID = "";
            }
          } else {
            userID = "";
          }
          isAdmin = val.admin;
          if (!isAdmin) {
            return $("<tr><td style='cursor: pointer'>" + userName + "</td><td>" + userID + "</td></tr>").appendTo($(_this.table1));
          }
        };
      })(this));
    };

    return UserEdit;

  })();

  UserAccount = (function() {
    function UserAccount(name, admin, enabled, changePassword, groups, email, extraFields, password) {
      this.name = name;
      this.admin = admin;
      this.enabled = enabled;
      this.changePassword = changePassword;
      this.groups = groups;
      this.email = email;
      this.extraFields = extraFields;
      this.password = password;
    }

    return UserAccount;

  })();

  UserAccountNoPass = (function() {
    function UserAccountNoPass(name, admin, enabled, changePassword, groups, email, extraFields) {
      this.name = name;
      this.admin = admin;
      this.enabled = enabled;
      this.changePassword = changePassword;
      this.groups = groups;
      this.email = email;
      this.extraFields = extraFields;
    }

    return UserAccountNoPass;

  })();

  cp.UserAccount = UserAccount;

  cp.UserEdit = UserEdit;

  cp.UserAccountNoPass = UserAccountNoPass;

}).call(this);
