(function() {
  var BasicInfo, ChitChatSection, NumberInfo, TermInfo,
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
          _this.saveActivityDetail();
          if ($(_this.form).valid() && $(_this.formUpload).valid()) {
            return _this.formUpload.submit();
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
            date: true
          },
          faci: {
            required: true
          },
          cljtour: {
            required: true
          },
          phase2date: {
            required: true,
            date: true
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
            required: "Please enter an advisor's name"
          },
          venue: {
            required: "Please enter a venue's name"
          },
          phase1date: {
            required: "Please enter phase 1 date",
            date: "Please enter a valid date"
          },
          faci: {
            required: "Please enter a facilitator's name"
          },
          cljtour: {
            required: "Please enter a CLJ Tour"
          },
          phase2date: {
            required: "Please enter phase 2 date",
            date: "Please enter a valid date"
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
      var adviser, convertPhase1Date, convertPhase2Date, division, e_cn_part, e_in_part, e_ma_part, e_other_part, faci, foreigner_part, grc, immi_part, item, n_cn_part, n_india_part, n_indo_part, n_local_part, n_ma_part, n_other_part, n_other_remark, n_philip_part, phase1, phase2, postURL, rcnc, remark, sg_part, termItem, tour, venue;
      this.infoSpan.text("Saving...");
      item = {};
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
      termItem = new cp.TermInfo("AH", "2013-08-31", "2015-09-30", "http://google.com");
      console.info(termItem);
      postURL = cp.buildSafeUrl("/adhoc/chitchat/update/ccc-term");
      return $.ajax({
        type: 'post',
        url: postURL,
        contentType: 'application/json',
        data: JSON.stringify(termItem),
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

  TermInfo = (function() {
    function TermInfo(div_code, term_start_date, term_end_date, excel_url) {
      this.div_code = div_code;
      this.term_start_date = term_start_date;
      this.term_end_date = term_end_date;
      this.excel_url = excel_url;
    }

    return TermInfo;

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

  cp.TermInfo = TermInfo;

  cp.ChitChatSection = ChitChatSection;

}).call(this);

(function() {
  var BankAccountInput, HorizontalBootstrapForm, InlineBootstrapForm, SingaporeDollarsInput;

  HorizontalBootstrapForm = (function() {
    HorizontalBootstrapForm.DefaultOptions = function() {
      return {
        labelClass: "col-sm-2",
        fieldClass: "col-sm-10",
        offsetClass: "col-sm-offset-2"
      };
    };

    HorizontalBootstrapForm.ThreeNineOptions = function() {
      return {
        labelClass: "col-sm-3",
        fieldClass: "col-sm-9",
        offsetClass: "col-sm-offset-3"
      };
    };

    HorizontalBootstrapForm.OneElevenOptions = function() {
      return {
        labelClass: "col-sm-1",
        fieldClass: "col-sm-11",
        offsetClass: "col-sm-offset-1"
      };
    };

    HorizontalBootstrapForm.AllInOneOptions = function() {
      return {
        labelClass: "",
        fieldClass: "col-sm-12",
        offsetClass: ""
      };
    };

    function HorizontalBootstrapForm(parent, options) {
      this.form = $("<form class='form-horizontal' role='form'></form>").appendTo(parent);
      this.options = _.defaults({}, options, HorizontalBootstrapForm.DefaultOptions());
      this.currentGroup = null;
    }

    HorizontalBootstrapForm.prototype.addGroup = function() {
      this.currentGroup = $("<div class='form-group'></div>").appendTo(this.form);
      return this.currentGroup;
    };

    HorizontalBootstrapForm.prototype.addLabel = function(text) {
      return $("<label class='" + this.options.labelClass + " control-label'>" + text + "</label>").appendTo(this.currentGroup);
    };

    HorizontalBootstrapForm.prototype.addField = function() {
      return $("<div class='" + this.options.fieldClass + "'></div>").appendTo(this.currentGroup);
    };

    HorizontalBootstrapForm.prototype.addStatic = function(text) {
      return $("<p class='form-control-static'>" + text + "</p>").appendTo(this.addField());
    };

    HorizontalBootstrapForm.prototype.configureInputConstraints = function(inputField, type) {
      switch (type) {
        case "email":
          return new biz.Input.Email(inputField);
        case "tel":
          return new biz.Input.Tel(inputField);
      }
    };

    HorizontalBootstrapForm.prototype.addInput = function(type, value, maxLength) {
      var inputField;
      inputField = $("<input class='form-control' type='" + type + "' value='" + value + "'></input>").appendTo(this.addField());
      if (maxLength) {
        inputField.attr("maxlength", maxLength);
      }
      this.configureInputConstraints(inputField, type);
      return inputField;
    };

    HorizontalBootstrapForm.prototype.addInputChoices = function(type, value, maxLength, list) {
      var inputField;
      inputField = $("<input class='form-control' type='" + type + "' list='" + list + "' value='" + value + "'></input>").appendTo(this.addField());
      if (maxLength) {
        inputField.attr("maxlength", maxLength);
      }
      this.configureInputConstraints(inputField, type);
      return inputField;
    };

    HorizontalBootstrapForm.prototype.addTextArea = function(value, maxLength) {
      return this.addInput("text", value, maxLength);
    };

    HorizontalBootstrapForm.prototype.addSelect = function() {
      return $("<select class='form-control'></select>").appendTo(this.addField());
    };

    HorizontalBootstrapForm.prototype.addCheckbox = function(text) {
      var field, input, label;
      field = this.addField();
      label = $("<label>" + text + "</label>").appendTo(field);
      input = $("<input type='checkbox'></input>").css("margin-right", "5px").prependTo(label);
      field.val = function(v) {
        if (arguments.length === 0) {
          return input.prop("checked");
        } else {
          return input.prop("checked", !!v);
        }
      };
      return field;
    };

    HorizontalBootstrapForm.prototype.hiddenRow = function(value) {
      return $("<input type='hidden' value='" + value + "'></input>").appendTo(this.form);
    };

    HorizontalBootstrapForm.prototype.divRow = function(label) {
      this.addGroup();
      this.addLabel(label);
      return $("<div></div>").appendTo(this.addField());
    };

    HorizontalBootstrapForm.prototype.fixedRow = function(label, value) {
      this.addGroup();
      this.addLabel(label);
      return this.addStatic(value || "");
    };

    HorizontalBootstrapForm.prototype.inputRow = function(label, value, maxLength) {
      this.addGroup();
      this.addLabel(label);
      return this.addInput("text", value || "", maxLength);
    };

    HorizontalBootstrapForm.prototype.textAreaRow = function(label, value, maxLength) {
      this.addGroup();
      this.addLabel(label);
      return this.addTextArea(value || "", maxLength);
    };

    HorizontalBootstrapForm.prototype.inputChoicesRow = function(label, value, maxLength, list) {
      this.addGroup();
      this.addLabel(label);
      return this.addInputChoices("text", value || "", maxLength, list);
    };

    HorizontalBootstrapForm.prototype.passwordRow = function(label) {
      this.addGroup();
      this.addLabel(label);
      return this.addInput("password", "");
    };

    HorizontalBootstrapForm.prototype.typedInputRow = function(type, label, value, maxLength) {
      this.addGroup();
      this.addLabel(label);
      return this.addInput(type, value || "", maxLength);
    };

    HorizontalBootstrapForm.prototype.selectRow = function(label) {
      this.addGroup();
      this.addLabel(label);
      return this.addSelect();
    };

    HorizontalBootstrapForm.prototype.checkboxRow = function(label) {
      this.addGroup();
      this.addLabel("");
      return this.addCheckbox(label);
    };

    HorizontalBootstrapForm.prototype.inputRowWithButton = function(label, value, maxLength, buttonText) {
      var button, field, inputField, inputGroup, inputSpan;
      this.addGroup();
      this.addLabel(label);
      field = this.addField();
      inputGroup = $("<div class='input-group'></div>").appendTo(field);
      inputField = $("<input class='form-control' type='text' value='" + value + "'></input>").appendTo(inputGroup);
      if (maxLength) {
        inputField.attr("maxlength", maxLength);
      }
      inputSpan = $("<span class='input-group-btn'></span>").appendTo(inputGroup);
      button = $("<button class='btn'>" + buttonText + "</button>").appendTo(inputSpan);
      return [inputField, button];
    };

    HorizontalBootstrapForm.prototype.buttonRow = function(buttonText) {
      var div, group, labelClass;
      labelClass = labelClass || "col-sm-offset-2 col-sm-10";
      group = this.addGroup();
      div = $("<div class='" + this.options.offsetClass + " " + this.options.fieldClass + "'>").appendTo(group);
      return $("<button class='btn btn-primary'>" + buttonText + "</button>").appendTo(div);
    };

    return HorizontalBootstrapForm;

  })();

  InlineBootstrapForm = (function() {
    InlineBootstrapForm.DefaultOptions = function() {
      return {
        labelClass: "col-sm-3",
        fieldClass: "col-sm-3",
        offsetClass: ""
      };
    };

    function InlineBootstrapForm(parent, options) {
      this.form = $("<form class='form-inline' role='form'></form>").appendTo(parent);
      this.options = _.defaults({}, options, InlineBootstrapForm.DefaultOptions());
      this.currentGroup = null;
    }

    InlineBootstrapForm.prototype.addGroup = function() {
      this.currentGroup = $("<div class='form-group'></div>").appendTo(this.form);
      return this.currentGroup;
    };

    InlineBootstrapForm.prototype.addLabel = function(text) {
      return $("<label class='" + this.options.labelClass + " control-label'>" + text + "</label>").appendTo(this.currentGroup);
    };

    InlineBootstrapForm.prototype.addField = function() {
      return $("<div class='" + this.options.fieldClass + "'></div>").appendTo(this.currentGroup);
    };

    InlineBootstrapForm.prototype.checkboxRow = function(text) {
      var input, label, wrapper;
      this.currentGroup = $("<div></div>").appendTo(this.form);
      this.currentGroup;
      label = this.addLabel(text);
      input = $("<input type='checkbox'></input>").css("margin-right", "5px").prependTo(label);
      wrapper = {
        val: function(v) {
          if (arguments.length === 0) {
            return input.prop("checked");
          } else {
            return input.prop("checked", !!v);
          }
        }
      };
      return wrapper;
    };

    return InlineBootstrapForm;

  })();

  SingaporeDollarsInput = (function() {
    function SingaporeDollarsInput(parent) {
      this.div1 = $("<div class='input-group pull-left'></div>").css("width", "150px").appendTo(parent);
      $("<span class='input-group-addon'>S$</span>").appendTo(this.div1);
      this.dollars = $("<input class='form-control' type='text' maxlength='9' cols='9'></input>").css("text-align", "right").appendTo(this.div1);
      this.div2 = $("<div class='input-group pull-left'></div>").css("width", "70px").appendTo(parent);
      $("<span class='input-group-addon'>.</span>").appendTo(this.div2);
      this.cents = $("<input class='form-control' type='text' maxlength='2' cols='2'></input>").appendTo(this.div2);
      new biz.Input.Numeric(this.dollars);
      new biz.Input.Numeric(this.cents);
    }

    SingaporeDollarsInput.prototype.val = function(v) {
      var cents, dollars;
      if (arguments.length === 0) {
        return (parseInt(this.dollars.val()) * 100) + parseInt(this.cents.val());
      } else {
        if (v === "0" || v === "") {
          v = 0;
        }
        v = Math.floor(v);
        cents = "" + (v % 100);
        if (cents < 10) {
          cents = "0" + cents;
        }
        dollars = (v / 100).toFixed(0);
        this.dollars.val(dollars);
        return this.cents.val(cents);
      }
    };

    return SingaporeDollarsInput;

  })();

  BankAccountInput = (function() {
    function BankAccountInput(parent) {
      this.div1 = $("<div class='input-group pull-left'></div>").css("width", "70px").appendTo(parent);
      this.bank = $("<input class='form-control' title='Bank No.' type='text' maxlength='4' cols='4'></input>").css("text-align", "right").appendTo(this.div1);
      this.div2 = $("<div class='input-group pull-left'></div>").css("width", "80px").appendTo(parent);
      $("<span class='input-group-addon'>-</span>").appendTo(this.div2);
      this.branch = $("<input class='form-control' title='Branch No.' type='text' maxlength='3' cols='3'></input>").appendTo(this.div2);
      this.div3 = $("<div class='input-group pull-left'></div>").css("width", "160px").appendTo(parent);
      $("<span class='input-group-addon'>-</span>").appendTo(this.div3);
      this.account = $("<input class='form-control' title='Account No.' type='text' maxlength='11' cols='11'></input>").appendTo(this.div3);
      new biz.Input.Numeric(this.bank);
      new biz.Input.Numeric(this.branch);
      new biz.Input.Numeric(this.account);
    }

    BankAccountInput.prototype.val = function(v) {
      if (arguments.length === 0) {
        return {
          bank: this.bank.val(),
          branch: this.branch.val(),
          account: this.account.val()
        };
      } else {
        this.bank.val(v.bank || "");
        this.branch.val(v.branch || "");
        return this.account.val(v.account || "");
      }
    };

    return BankAccountInput;

  })();

  cp.HorizontalBootstrapForm = HorizontalBootstrapForm;

  cp.InlineBootstrapForm = InlineBootstrapForm;

  cp.SingaporeDollarsInput = SingaporeDollarsInput;

  cp.BankAccountInput = BankAccountInput;

}).call(this);
