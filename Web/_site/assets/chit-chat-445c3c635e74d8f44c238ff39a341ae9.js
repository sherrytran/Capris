(function() {
  var BasicInfo, ChitChatSection, NumberInfo,
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
          if ($(_this.form).valid() && $(_this.formUpload).valid()) {
            _this.formUpload.submit();
            return _this.saveActivityDetail();
          }
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
      var adviser, basicItem, convertPhase1Date, convertPhase2Date, division, e_cn_part, e_in_part, e_ma_part, e_other_part, faci, foreigner_part, grc, immi_part, item, n_cn_part, n_india_part, n_indo_part, n_local_part, n_ma_part, n_other_part, n_other_remark, n_philip_part, numberItem, path, phase1, phase2, postURL, rcnc, remark, sg_part, tour, uploadURL, venue;
      this.infoSpan.text("Saving...");
      item = {
        basic: [],
        number: []
      };
      grc = '';
      division = $("#div").val();
      rcnc = $("#rcnc").val();
      adviser = $("#adv").val();
      venue = $("#venue").val();
      faci = $("#faci").val();
      tour = $("#tour").val();
      phase1 = $("#phase1").val();
      convertPhase1Date = $.datepicker.formatDate('yy-mm-dd', new Date(phase1));
      phase2 = $("#phase2").val();
      convertPhase2Date = $.datepicker.formatDate('yy-mm-dd', new Date(phase2));
      remark = $("#remark").val();
      path = $("#upload-dialog-name")[0].files[0].name;
      uploadURL = "http://localhost:9080/elx/do/cpr/dc/content/" + path + "?elx.attachment";
      sg_part = parseInt($("#local-part").val());
      immi_part = parseInt($("#immi-part").val());
      foreigner_part = parseInt($("#fg-part").val());
      n_local_part = parseInt($("#n_local_part").val());
      n_india_part = parseInt($("#n_india_part").val());
      n_indo_part = parseInt($("#n_indo_part").val());
      n_ma_part = parseInt($("#n_malay_part").val());
      n_cn_part = parseInt($("#n_cn_part").val());
      n_philip_part = parseInt($("#n_ph_part").val());
      n_other_part = parseInt($("#n_other_part").val());
      n_other_remark = $("#n_other_remark").val();
      e_ma_part = parseInt($("#e-ma-part").val());
      e_in_part = parseInt($("#e-in-part").val());
      e_cn_part = parseInt($("#e-cn-part").val());
      e_other_part = parseInt($("#e-other-part").val());
      basicItem = new cp.BasicInfo(grc, division, rcnc, adviser, venue, faci, tour, convertPhase1Date, convertPhase2Date, remark);
      numberItem = new cp.NumberInfo(sg_part, immi_part, foreigner_part, n_cn_part, n_ma_part, n_india_part, n_local_part, n_indo_part, n_philip_part, n_other_part, n_other_remark, e_cn_part, e_ma_part, e_in_part, e_other_part, uploadURL);
      item.basic.push(basicItem);
      item.number.push(numberItem);
      postURL = cp.buildSafeUrl("/adhoc/chitchat/update/chit-chat-activity");
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

    return ChitChatSection;

  })();

  BasicInfo = (function() {
    function BasicInfo(cs_code, div_code, rc_code, adviser, venue, faci, tour, phase1_date, phase2_date, remark) {
      this.cs_code = cs_code;
      this.div_code = div_code;
      this.rc_code = rc_code;
      this.adviser = adviser;
      this.venue = venue;
      this.faci = faci;
      this.tour = tour;
      this.phase1_date = phase1_date;
      this.phase2_date = phase2_date;
      this.remark = remark;
    }

    return BasicInfo;

  })();

  NumberInfo = (function() {
    function NumberInfo(ci_local_part, ci_imm_part, ci_for_part, co_china_part, co_malaysia_part, co_india_part, co_sing_part, co_indonesia_part, co_philip_part, co_other_part, co_other_remark, et_chinese_part, et_malay_part, et_indian_part, et_other_part, url) {
      this.ci_local_part = ci_local_part;
      this.ci_imm_part = ci_imm_part;
      this.ci_for_part = ci_for_part;
      this.co_china_part = co_china_part;
      this.co_malaysia_part = co_malaysia_part;
      this.co_india_part = co_india_part;
      this.co_sing_part = co_sing_part;
      this.co_indonesia_part = co_indonesia_part;
      this.co_philip_part = co_philip_part;
      this.co_other_part = co_other_part;
      this.co_other_remark = co_other_remark;
      this.et_chinese_part = et_chinese_part;
      this.et_malay_part = et_malay_part;
      this.et_indian_part = et_indian_part;
      this.et_other_part = et_other_part;
      this.url = url;
    }

    return NumberInfo;

  })();

  cp.BasicInfo = BasicInfo;

  cp.NumberInfo = NumberInfo;

  cp.ChitChatSection = ChitChatSection;

}).call(this);
