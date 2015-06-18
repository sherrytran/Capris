(function() {
  var ActivityItems, BasicInfo, ChitChatSection,
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

  $.validator.addMethod('anyDate', (function(value, element) {
    return value.match(/^(0?[1-9]|[12][0-9]|3[0-1])[/](0?[1-9]|1[0-2])[/](19|20)?\d{2}$/);
  }), 'Please enter a valid date dd/mm/yyyy');

  $.validator.addMethod('greaterThan', (function(value, element, params) {
    if (!/Invalid|NaN/.test(new Date(value))) {
      return new Date(value) > new Date($(params).val());
    }
    return isNaN(value) && isNaN($(params).val()) || Number(value) > Number($(params).val());
  }), 'Must be greater than {0}.');

  $.validator.addMethod('time', (function(value, element) {
    return this.optional(element) || /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i.test(value);
  }), 'Please enter a valid time.');

  ChitChatSection = (function() {
    function ChitChatSection() {
      this.pass = __bind(this.pass, this);
      this.saveActivityDetail = __bind(this.saveActivityDetail, this);
      this.secureDivision = __bind(this.secureDivision, this);
      this.loadLocationList = __bind(this.loadLocationList, this);
      this.buildRCNC = __bind(this.buildRCNC, this);
      this.buildDivision = __bind(this.buildDivision, this);
      this.buildGRC = __bind(this.buildGRC, this);
      this.validate = __bind(this.validate, this);
      this.fillChitChat = __bind(this.fillChitChat, this);
      var cred;
      cred = cp.credentials;
      this.contents = $("#chit-chat-section-contents");
      this.fillChitChat();
    }

    ChitChatSection.prototype.fillChitChat = function() {
      var table, table3, tr1, tr3, tr5, url;
      url = cp.buildSafeUrl("/dc/content/CPR") + "?action=upload";
      this.actList = [];
      this.loadLocationList();
      this.form = $("#chitchat-form");
      table = $("#first-table");
      $("#phase1").datepicker({
        dateFormat: 'dd/mm/yy'
      });
      $("#phase2").datepicker({
        dateFormat: 'dd/mm/yy'
      });
      table3 = $("<table class='table table-responsive'></table>").insertAfter(table);
      tr1 = $("<tr></tr>").appendTo(table3);
      $("<td colspan='2'  align='center'><h2>Citizen Type</h2></td>").appendTo(tr1);
      $("<tr><th></th><th>Participant(s)</th>").appendTo(table3);
      $("<tr><th>Locals *</th><td><input id='local-part' name='localpart' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>New Immigrants *</th><td><input id='immi-part' name='immipart' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>Foreigners *</th><td><input id='fg-part' name='fgpart' class='form-control input-sm' type='text'></td>").appendTo(table3);
      tr3 = $("<tr></tr>").appendTo(table3);
      $("<td colspan='2' align='center'><h2>Country Of Birth</h2></td>").appendTo(tr3);
      $("<tr><th>Singapore *</th><td><input id='n_local_part' name='n_local_part' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>India *</th><td><input id='n_india_part' name='n_india_part' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>Indonesia *</th><td><input id='n_indo_part' name='n_indo_part' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>Malaysia *</th><td><input id='n_malay_part' name='n_malay_part' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>People Republic Of China *</th><td><input id='n_cn_part' name='n_cn_part' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>Philippines *</th><td><input id='n_ph_part' name='n_ph_part' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>Others *</th><td><input id='n_other_part' name='n_other_part' class='form-control input-sm' type='text'></td><td>Please State e.g (2 British, 1 Korean):</td><td><input id='n_other_remark' class='form-control input-sm' type='text'></td>").appendTo(table3);
      tr5 = $("<tr></tr>").appendTo(table3);
      $("<td colspan='2' align='center'><h2>Ethnic</h2></td>").appendTo(tr5);
      $("<tr><th>Chinese *</th><td><input id='e-cn-part' name='ecnpart' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>Malay *</th><td><input id='e-ma-part' name='emapart' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>Indian *</th><td><input id='e-in-part' name='einpart' class='form-control input-sm' type='text'></td>").appendTo(table3);
      $("<tr><th>Others *</th><td><input id='e-other-part' name='eotherpart' class='form-control input-sm' type='text'></td>").appendTo(table3);
      this.formUpload = $("<form id='upload-dialog-form' action='" + url + "' enctype='multipart/form-data' method='post' name='upload' target='upload-iframe' />").insertAfter(this.form);
      $("<input id='upload-dialog-name' name='uploadFile' type='file' name='file'/>").appendTo(this.formUpload);
      $("<iframe id='upload-iframe' name='upload-iframe' src='' style='width:0;height:0;border:0px solid #fff;'></iframe>").insertAfter(table3);
      this.breakpoint = $("<br>").insertAfter(this.formUpload);
      this.button = $("<button class='btn btn-primary'>Submit</button>").insertAfter(this.breakpoint);
      this.infoSpan = $("<p style='display:inline;margin-left:8px'></p>").insertAfter(this.button);
      this.button.click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.saveActivityDetail();
        };
      })(this));
      return $("#div").on("change", (function(_this) {
        return function() {
          $("#rcnc").empty();
          _this.currentDiv = $("#div").val();
          return _this.onLoadLocation(_this.currentDiv, _this.buildRCNC);
        };
      })(this));
    };

    ChitChatSection.prototype.validate = function() {
      $(this.formUpload).validate({
        rules: {
          uploadFile: {
            required: true
          }
        },
        messages: {
          uploadFile: {
            required: "Please attach your file"
          }
        }
      });
      return $(this.form).validate({
        rules: {
          advisor: {
            required: true
          },
          venue: {
            required: true
          },
          phase1date: {
            required: true,
            anyDate: true
          },
          faci: {
            required: true
          },
          cljtour: {
            required: true
          },
          phase2date: {
            anyDate: true,
            greaterThan: "#phase1"
          },
          localpart: {
            required: true,
            number: true
          },
          immipart: {
            required: true,
            number: true
          },
          fgpart: {
            required: true,
            number: true
          },
          n_local_part: {
            required: true,
            number: true
          },
          n_india_part: {
            required: true,
            number: true
          },
          n_indo_part: {
            required: true,
            number: true
          },
          n_malay_part: {
            required: true,
            number: true
          },
          n_cn_part: {
            required: true,
            number: true
          },
          n_ph_part: {
            required: true,
            number: true
          },
          n_other_part: {
            required: true,
            number: true
          },
          ecnpart: {
            required: true,
            number: true
          },
          emapart: {
            required: true,
            number: true
          },
          einpart: {
            required: true,
            number: true
          },
          eotherpart: {
            required: true,
            number: true
          }
        },
        messages: {
          advisor: {
            required: "Please enter an adviser's name"
          },
          venue: {
            required: "Please enter a venue's name"
          },
          phase1date: {
            required: "Please enter phase 1 date"
          },
          faci: {
            required: "Please enter a facilitator's name"
          },
          cljtour: {
            required: "Please enter a CLJ Tour"
          },
          localpart: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          immipart: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          fgpart: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          n_local_part: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          n_india_part: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          n_indo_part: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          n_malay_part: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          n_cn_part: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          n_ph_part: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          n_other_part: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          ecnpart: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          emapart: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          einpart: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          },
          eotherpart: {
            required: "Please enter a number",
            number: "Please enter a valid number"
          }
        }
      });
    };

    ChitChatSection.prototype.buildGRC = function(data) {
      var arr2, c, valueToString, _i, _len;
      valueToString = function(v) {
        return v.toString();
      };
      arr2 = _.uniq(data, false, valueToString);
      for (_i = 0, _len = arr2.length; _i < _len; _i++) {
        c = arr2[_i];
        $("<option value='" + c[0] + "'>" + c[1] + "</option>").appendTo($("#grc"));
      }
      this.currentGRC = $("#grc").val();
      return this.onLoadLocation(this.currentGRC, this.buildDivision);
    };

    ChitChatSection.prototype.buildDivision = function(data) {
      var arr3, c, valueToString, _i, _len;
      valueToString = function(v) {
        return v.toString();
      };
      arr3 = _.uniq(data, false, valueToString);
      for (_i = 0, _len = arr3.length; _i < _len; _i++) {
        c = arr3[_i];
        $("<option value='" + c[0] + "'>" + c[1] + "</option>").appendTo($("#div"));
      }
      this.currentDiv = $("#div").val();
      return this.onLoadLocation(this.currentDiv, this.buildRCNC);
    };

    ChitChatSection.prototype.buildRCNC = function(data) {
      var v, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        v = data[_i];
        _results.push($("<option value='" + v.rc_code + "'>" + v.rc_name + "</option>").appendTo($("#rcnc")));
      }
      return _results;
    };

    ChitChatSection.prototype.loadLocationList = function() {
      return this.onSelect(this.buildDivision, "c_cdd_cs_div", "div_code", "div_name");
    };

    ChitChatSection.prototype.secureDivision = function(data) {
      data;
      return this.filterDiv = data;
    };

    ChitChatSection.prototype.saveActivityDetail = function() {
      return this.onSave(this.pass);
    };

    ChitChatSection.prototype.pass = function() {
      console.info("success");
      this.infoSpan.text("Save Successfully");
      return window.setTimeout(((function(_this) {
        return function() {
          return _this.infoSpan.text("");
        };
      })(this)), 4000);
    };

    ChitChatSection.prototype.onSelect = function(andThen, table, col1, col2) {
      var postURL, req;
      req = {
        jsonClass: "FieldRequest",
        universe: "capris",
        table: table,
        column: col1,
        criteria: {
          jsonClass: "ComparisonCriteria",
          operation: "starts-with",
          value: ""
        },
        pk: {
          table: table,
          column: col2
        },
        security: {
          table: table,
          column: "cgd_id"
        },
        page: {
          offset: 0,
          length: 0
        },
        mimeType: {
          value: "application/json"
        }
      };
      postURL = cp.buildSafeUrl("/uv/universe/capris");
      return $.ajax({
        type: 'post',
        url: postURL,
        data: JSON.stringify(req),
        contentType: "application/json",
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

    ChitChatSection.prototype.onLoadLocation = function(div, andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/adhoc/chitchat/get/chit-chat-location/" + div);
      console.info(postURL);
      return $.ajax({
        type: 'get',
        url: postURL,
        data: 'json',
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

    ChitChatSection.prototype.onSave = function(andThen) {
      var activity, activity2, itemAct, postURL;
      itemAct = {
        items: [],
        title: "testing",
        date: "2014-03-14",
        startTime: "10:00:00",
        endTime: "12:00:00",
        desc: "desc",
        divCode: "AH",
        rcCode: "RM",
        preRemind: 2,
        postRemind: 3,
        nric: ["S1234B", "S456"]
      };
      activity = new cp.ActivityItems("S1234B", "04", "211", "1234", "2014-04-13");
      itemAct.items.push(activity);
      activity2 = new cp.ActivityItems("S1234C", "04", "211", "1234", "2014-04-14");
      itemAct.items.push(activity2);
      postURL = cp.buildSafeUrl("/adhoc/web/update/house-visit-activity-plan");
      return $.ajax({
        type: 'post',
        url: postURL,
        contentType: 'application/json',
        data: JSON.stringify(itemAct),
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

    return ChitChatSection;

  })();

  ActivityItems = (function() {
    function ActivityItems(nric, floorNo, unitNo, postalCode, reg_date) {
      this.nric = nric;
      this.floorNo = floorNo;
      this.unitNo = unitNo;
      this.postalCode = postalCode;
      this.reg_date = reg_date;
    }

    return ActivityItems;

  })();

  BasicInfo = (function() {
    function BasicInfo(title, date, startTime, endTime, desc, divCode, rcCode, preRemind, postRemind, nric) {
      this.title = title;
      this.date = date;
      this.startTime = startTime;
      this.endTime = endTime;
      this.desc = desc;
      this.divCode = divCode;
      this.rcCode = rcCode;
      this.preRemind = preRemind;
      this.postRemind = postRemind;
      this.nric = nric;
    }

    return BasicInfo;

  })();

  cp.BasicInfo = BasicInfo;

  cp.ActivityItems = ActivityItems;

  cp.ChitChatSection = ChitChatSection;

}).call(this);
