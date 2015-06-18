(function() {
  var GroupConfig,
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

  GroupConfig = (function() {
    function GroupConfig() {
      this.successCreate = __bind(this.successCreate, this);
      this.result = __bind(this.result, this);
      this.buildGroups = __bind(this.buildGroups, this);
      this.createGroup = __bind(this.createGroup, this);
      this.loadAllFilesACL = __bind(this.loadAllFilesACL, this);
      this.doInitCheckboxes = __bind(this.doInitCheckboxes, this);
      this.successAdded = __bind(this.successAdded, this);
      this.fillGroup = __bind(this.fillGroup, this);
      this.init = __bind(this.init, this);
      var cred;
      cred = cp.credentials;
      this.accessArray = [];
      this.contents = $("#management-contents");
      this.fillGroup();
      this.init();
    }

    GroupConfig.prototype.init = function() {
      this.onLoadGroup(this.buildGroups);
      this.fileArray = ["NewCitizen_PR_Resident", "HouseVisit_Plan", "HouseVisit_Update", "HouseVisit_Report", "IntegrationEngagement_Config", "IntegrationEngagement_KPI_Budget_Allocation", "IntegrationEngagement_Activity", "IntegrationEngagement_Report", "ChitChat_Session", "ChitChat_Report", "INC_Upload", "INC_HQ", "INC_Report", "Letter_Generation", "CSSGCC_Plan", "CSSGCC_Update", "CSSGCC_SET_Update", "ROM_Landing_Page", "ROM_Upload", "ROM_Maintain_Solemnizer", "ROM_Configure_Division", "ROM_Report"];
      this.loadAllFilesACL();
      return this.initCheckboxes = _.after(this.fileArray.length, this.doInitCheckboxes);
    };

    GroupConfig.prototype.fillGroup = function() {
      var table, table2, tr, tr1, tr4;
      this.form = $("#create-user-form");
      table = $("#first-table");
      tr = $("<tr></tr>").appendTo(table);
      $("<td colspan='2'  align='left'><h4>Add Group</h4></td>").appendTo(tr);
      $("<tr><th>Group Name</th><td><input id='add-group' type='text'></td><td><button class='btn btn-primary' id='create-but'>Create</button>").appendTo(table);
      table2 = $("<table id='second-table' class='table table-responsive' style='width: 50%;'></table>").insertAfter(table);
      tr1 = $("<tr></tr>").appendTo(table2);
      $("<td colspan='2'  align='left'><h4>User Profile</h4></td>").appendTo(tr1);
      $("<tr><th>Access Group</th><td><select id='access-group' class='form-control input-sm'></select></td>").appendTo(table2);
      tr4 = $("<tr></tr>").appendTo(table2);
      $("<td colspan='2'  align='left'><h4>List Of Modules</h4></td>").appendTo(tr4);
      $("<tr><th>Information Report on New Residents, New PRs and NCs for all Divisions</th><td><input class='checkbox_checked' id='NewCitizen_PR_Resident' type='checkbox' value='NewCitizen_PR_Resident'></td>").appendTo(table2);
      $("<tr><th>HV Planning</th><td><input class='checkbox_checked' id='HouseVisit_Plan' input-sm' type='checkbox' value='Plan_House_Visit'></td>").appendTo(table2);
      $("<tr><th>HV Update</th><td><input class='checkbox_checked' id='HouseVisit_Update' type='checkbox' value='Update_House_Visit'></td>").appendTo(table2);
      $("<tr><th>HV Report</th><td><input class='checkbox_checked' id='HouseVisit_Report' input-sm' type='checkbox' value='House_Visit_Report'></td>").appendTo(table2);
      $("<tr><th>INT Configuration</th><td><input class='checkbox_checked' id='IntegrationEngagement_Config' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>KPI & Budget Allocation</th><td><input class='checkbox_checked' id='IntegrationEngagement_KPI_Budget_Allocation' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>Activities</th><td><input class='checkbox_checked' id='IntegrationEngagement_Activity' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>INT Report</th><td><input class='checkbox_checked' id='IntegrationEngagement_Report' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>Chit Chat Session </th><td><input class='checkbox_checked' id='ChitChat_Session' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>Chit Chat Report</th><td><input class='checkbox_checked' id='ChitChat_Report' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>Letter Generation Welcome Letter</th><td><input class='checkbox_checked' id='Letter_Generation' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>INC Upload Appointment/Re-appointment</th><td><input class='checkbox_checked' id='INC_Upload' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>INC View Upload Status</th><td><input class='checkbox_checked' id='INC_HQ' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>INC Reports</th><td><input class='checkbox_checked' id='INC_Report' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>ROM Landing Page</th><td><input class='checkbox_checked' id='ROM_Landing_Page' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>ROM Upload Files</th><td><input class='checkbox_checked' id='ROM_Upload' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>ROM Maintain Solemnizer</th><td><input class='checkbox_checked' id='ROM_Maintain_Solemnizer' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>ROM Configuration Division</th><td><input class='checkbox_checked' id='ROM_Configuration_Division' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>ROM Report</th><td><input class='checkbox_checked' id='ROM_Report' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>CSS/GCC Plan</th><td><input class='checkbox_checked' id='CSSGCC_Plan' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>CSS/GCC Update</th><td><input class='checkbox_checked' id='CSSGCC_Update' input-sm' type='checkbox'></td>").appendTo(table2);
      $("<tr><th>SET Update</th><td><input class='checkbox_checked' id='CSSGCC_SET_Update' input-sm' type='checkbox'></td>").appendTo(table2);
      $("#create-but").click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.onCreateGroup(_this.createGroup);
        };
      })(this));
      $("#access-group").on('change', (function(_this) {
        return function(e) {
          var group;
          group = $(e.target).attr('value');
          return $.each(_this.accessArray, function(i, val) {
            var fileName;
            if (_.some(val.acl, function(el) {
              return el.by === group;
            })) {
              fileName = val.path.split("/").pop().split(".")[0];
              return $("#" + fileName).prop("checked", true);
            } else {
              fileName = val.path.split("/").pop().split(".")[0];
              return $("#" + fileName).prop("checked", false);
            }
          });
        };
      })(this));
      return $(".checkbox_checked").on('click', (function(_this) {
        return function(e) {
          var dbName;
          dbName = $(e.target).attr('id');
          return $.each(_this.accessArray, function(i, val) {
            var checkedGroup, path;
            path = val.path;
            if (path.indexOf(dbName) > 0) {
              checkedGroup = $("#access-group").val();
              if ($(e.target).is(':checked')) {
                val.acl.push({
                  by: checkedGroup,
                  write: false
                });
              } else {
                val.acl = _.reject(val.acl, function(el) {
                  return el.by === checkedGroup;
                });
              }
              _this.AddGroupForDashboard(path, val, _this.successAdded);
              return false;
            }
          });
        };
      })(this));
    };

    GroupConfig.prototype.successAdded = function() {
      return console.info("success added");
    };

    GroupConfig.prototype.doInitCheckboxes = function() {
      var group;
      group = $("#access-group").val();
      return $.each(this.accessArray, (function(_this) {
        return function(i, val) {
          var fileName;
          if (_.some(val.acl, function(el) {
            return el.by === group;
          })) {
            fileName = val.path.split("/").pop().split(".")[0];
            return $("#" + fileName).prop("checked", true);
          } else {
            fileName = val.path.split("/").pop().split(".")[0];
            return $("#" + fileName).prop("checked", false);
          }
        };
      })(this));
    };

    GroupConfig.prototype.loadAllFilesACL = function() {
      var c, _i, _len, _ref, _results;
      _ref = this.fileArray;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(this.getDashboardInfo(c, this.result));
      }
      return _results;
    };

    GroupConfig.prototype.createGroup = function() {
      var name;
      name = this.newGroupName;
      $("<option>" + name + "</option>").appendTo($('#access-group'));
      $('#access-group').val(name);
      return $('#access-group').change();
    };

    GroupConfig.prototype.buildGroups = function(data) {
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

    GroupConfig.prototype.result = function(data) {
      this.accessArray.push(data);
      this.aclArray = data.acl;
      this.filePath = data.path;
      return this.initCheckboxes();
    };

    GroupConfig.prototype.successCreate = function() {
      return this.onCreate(this.result);
    };

    GroupConfig.prototype.onLoadGroup = function(andThen) {
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

    GroupConfig.prototype.onCreateGroup = function(andThen) {
      var item, postURL;
      this.newGroupName = $("#add-group").val();
      item = {
        name: "",
        users: []
      };
      if (this.newGroupName !== "") {
        item.name = this.newGroupName;
        postURL = cp.buildSafeUrl("/ad/usergroupdb/group");
        return $.ajax({
          type: 'post',
          url: postURL,
          contentType: 'application/json',
          data: JSON.stringify(item),
          success: andThen,
          error: (function(_this) {
            return function(jqXHR, textStatus, errorThrown) {
              console.info(textStatus);
              console.info(jqXHR);
              return console.info(errorThrown);
            };
          })(this)
        });
      } else {
        return alert("Please enter your group name.");
      }
    };

    GroupConfig.prototype.getDashboardInfo = function(dashboard, andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/dc/content/CAPRIS/dashboard/" + dashboard + ".dashboard") + "?query=effective-acl";
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

    GroupConfig.prototype.AddGroupForDashboard = function(path, item, andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/dc/content" + path) + "?action=acl";
      return $.ajax({
        type: 'post',
        url: postURL,
        contentType: 'application/json',
        data: JSON.stringify(item),
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

    return GroupConfig;

  })();

  cp.GroupConfig = GroupConfig;

}).call(this);
