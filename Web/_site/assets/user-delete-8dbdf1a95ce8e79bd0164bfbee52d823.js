(function() {
  var UserAccount, UserDelete,
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

  UserDelete = (function() {
    function UserDelete() {
      this.createNewFolder = __bind(this.createNewFolder, this);
      this.deleteOldFolder = __bind(this.deleteOldFolder, this);
      this.getUserEmail = __bind(this.getUserEmail, this);
      this["delete"] = __bind(this["delete"], this);
      this.doInitUser = __bind(this.doInitUser, this);
      this.deleteResult = __bind(this.deleteResult, this);
      this.createUserListAfterUpload = __bind(this.createUserListAfterUpload, this);
      this.result = __bind(this.result, this);
      this.fillManagement = __bind(this.fillManagement, this);
      var cred;
      this.checkedValue = [];
      cred = cp.credentials;
      this.contents = $("#delete-contents");
      this.emailArray = [];
      this.fillManagement();
      this.onLoadUser(this.result);
    }

    UserDelete.prototype.fillManagement = function() {
      var td, tdBut, tr, url;
      url = cp.buildSafeUrl("/dc/content/CPR/MyTest") + "?action=upload";
      this.form = $("#delete-user-form");
      this.table = $("#first-table");
      this.tableUpload = $("<table>").insertBefore(this.table);
      tr = $("<tr></tr>").appendTo(this.tableUpload);
      td = $("<td></td>").appendTo(tr);
      tdBut = $("<td></td>").appendTo(tr);
      this.formUpload = $("<form id='upload-dialog-form' action='" + url + "' enctype='multipart/form-data' method='post' name='upload' target='upload-iframe' />").appendTo(td);
      this.uploadBut = $("<button class='btn btn-primary'>Upload</button>").appendTo(tdBut);
      $("<input id='upload-dialog-name' name='uploadFile' type='file' name='file'/>").appendTo(this.formUpload);
      $("<iframe id='upload-iframe' name='upload-iframe' src='' style='width:0;height:0;border:0px solid #fff;'></iframe>").insertAfter(this.table);
      this.button = $("<button class='btn btn-primary'>Delete</button>").appendTo(this.form);
      this.uploadBut.click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.onDeleteFolder(_this.deleteOldFolder);
        };
      })(this));
      return this.button.click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this["delete"]();
        };
      })(this));
    };

    UserDelete.prototype.result = function(data) {
      var tr;
      tr = $("<tr></tr>").appendTo(this.table);
      $("<td colspan='2'  align='left'><h4>User Account</h4></td>").appendTo(tr);
      return $.each(data, (function(_this) {
        return function(i, val) {
          var userName;
          userName = val.name;
          return $("<tr><td>" + userName + "</td><td><input id='" + userName + "' value='" + userName + "' type='checkbox'></td>").appendTo($(_this.table));
        };
      })(this));
    };

    UserDelete.prototype.createUserListAfterUpload = function(data) {
      return $.each(data, (function(_this) {
        return function(i, val1) {
          $("#" + val1.name).attr('checked', false);
          return $.each(_this.emailArray, function(i, val2) {
            if (val1.email === val2) {
              return $("#" + val1.name).attr('checked', true);
            }
          });
        };
      })(this));
    };

    UserDelete.prototype.deleteResult = function() {
      return this.initUser();
    };

    UserDelete.prototype.doInitUser = function() {
      alert("Delete Successfully");
      this.table.empty();
      return this.onLoadUser(this.result);
    };

    UserDelete.prototype["delete"] = function() {
      this.checkedValues = $('input:checkbox:checked').map(function() {
        return this.value;
      }).get();
      if (this.checkedValues.length > 0) {
        this.initUser = _.after(this.checkedValues.length, this.doInitUser);
        return $.each(this.checkedValues, (function(_this) {
          return function(i, val) {
            return _this.onDelete(val, _this.deleteResult);
          };
        })(this));
      } else {
        return alert("You need to select at least 1 user to delete");
      }
    };

    UserDelete.prototype.onLoadUser = function(andThen) {
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

    UserDelete.prototype.onDelete = function(userName, andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/ad/usergroupdb/user/" + userName);
      return $.ajax({
        type: 'DELETE',
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

    UserDelete.prototype.onDeleteFolder = function(andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/dc/content/CPR/MyTest");
      return $.ajax({
        type: 'DELETE',
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

    UserDelete.prototype.onCreateFolder = function(andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/dc/content/CPR/MyTest/") + "?action=create-folder";
      return $.ajax({
        type: 'post',
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

    UserDelete.prototype.onLoadUserEmail = function(andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/ds/CPR/MyTest/cmp_HR.ds") + "?mime-type=application/json";
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

    UserDelete.prototype.getUserEmail = function(data) {
      this.emailArray = [];
      $.each(data.data, (function(_this) {
        return function(i, val) {
          return _this.emailArray.push(val.Email);
        };
      })(this));
      return this.onLoadUser(this.createUserListAfterUpload);
    };

    UserDelete.prototype.deleteOldFolder = function() {
      return this.onCreateFolder(this.createNewFolder);
    };

    UserDelete.prototype.createNewFolder = function() {
      this.formUpload.submit();
      $("#upload-iframe").unbind('load');
      return $("#upload-iframe").load((function(_this) {
        return function(e) {
          alert('Upload completed');
          return _this.onLoadUserEmail(_this.getUserEmail);
        };
      })(this));
    };

    return UserDelete;

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

  cp.UserDelete = UserDelete;

}).call(this);
