(function() {
  var ChitChatSection,
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
      this.result = __bind(this.result, this);
      this.pass = __bind(this.pass, this);
      this.saveActivityDetail = __bind(this.saveActivityDetail, this);
      this.loadLocationList = __bind(this.loadLocationList, this);
      this.buildRCNC = __bind(this.buildRCNC, this);
      this.buildDivision = __bind(this.buildDivision, this);
      this.fillChitChat = __bind(this.fillChitChat, this);
      var cred;
      cred = cp.credentials;
      this.contents = $("#chit-chat-section-contents");
      this.fillChitChat();
    }

    ChitChatSection.prototype.fillChitChat = function() {
      var button, form, remDiv, table1, table2, table3, td1, td2, td3, td4, tr1, tr2;
      this.actList = [];
      this.loadLocationList();
      this.div = $("<div style='max-height: 800px; overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(this.contents);
      form = new cp.HorizontalBootstrapForm(this.div);
      this.div = form.selectRow("Division");
      this.rcnc = form.selectRow("RC/NC");
      this.advisor = form.inputRow("Name of Advisor", "", 100);
      this.venue = form.inputRow("Venue", "", 100);
      this.date = form.inputRow("Date", "", 100);
      this.faci = form.inputRow("Name of Facilitator", "", 100);
      this.tour = form.inputRow("CLJ Tour", "", 100);
      this.datePhase1 = form.inputRow("Date for Phase 1", "", 100);
      this.datePhase2 = form.inputRow("Date for Phase 2", "", 100);
      remDiv = $("<div class='form-group'></div>").appendTo($(".form-horizontal"));
      $("<label class='col-sm-2 control-label'>Reimbursed (Y/N)</label>").appendTo(remDiv);
      $("<div class='col-sm-4'><input class='form-control' type='text'></div>").appendTo(remDiv);
      $("<label class='col-sm-2 control-label'>Remarks</label>").appendTo(remDiv);
      $("<div class='col-sm-4'><input class='form-control' type='text'></div>").appendTo(remDiv);
      table3 = $("<table class='table'></table>").insertAfter(remDiv);
      tr1 = $("<tr></tr>").appendTo(table3);
      td3 = $("<td align='center'><h2>Citizen Type</h2></td>").appendTo(tr1);
      td4 = $("<td align='center'><h2>Nationality</h2></td>").appendTo(tr1);
      tr2 = $("<tr></tr>").appendTo(table3);
      td1 = $("<td></td>").appendTo(tr2);
      td2 = $("<td></td>").appendTo(tr2);
      table1 = $("<table></table>").appendTo(td1);
      $("<tr><th></th><th>Invited</th><th>Participated</th>").appendTo(table1);
      $("<tr><th>Local Singaporean</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1);
      $("<tr><th>Naturalised Citizen</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1);
      $("<tr><th>New Citizen</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1);
      $("<tr><th>PRs</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1);
      $("<tr><th>Foreigners</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1);
      table2 = $("<table></table>").appendTo(td2);
      $("<tr><th></th><th></th><th></th>").appendTo(table2);
      $("<tr><th>Malaysian</th><td><input class='form-control' type='text'></td><td></td>").appendTo(table2);
      $("<tr><th>Indian</th><td><input class='form-control' type='text'></td><td></td>").appendTo(table2);
      $("<tr><th>China PRC</th><td><input class='form-control' type='text'></td><td></td>").appendTo(table2);
      $("<tr><th>Others</th><td><input class='form-control' type='text'></td><td>Please State e.g (2 British, 1 Korean):</td><td><input class='form-control' type='text'></td>").appendTo(table2);
      $("<tr><th>Foreigners</th><td><input class='form-control' type='text'></td><td></td>").appendTo(table2);
      button = form.buttonRow("Submit");
      button.click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.saveActivityDetail();
        };
      })(this));
      return $(this.div).on("change", (function(_this) {
        return function() {
          var divSel;
          _this.rcnc.empty();
          divSel = $(_this.div).find(":selected").text();
          return _this.buildRCNC(divSel);
        };
      })(this));
    };

    ChitChatSection.prototype.buildDivision = function() {
      var currentDiv, data, fullArray, i, uniqArray, v, _i, _j, _len, _len1;
      data = this.actList;
      fullArray = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        v = data[_i];
        console.info(v[1]);
        fullArray.push(v[1]);
      }
      uniqArray = _.uniq(fullArray);
      for (_j = 0, _len1 = uniqArray.length; _j < _len1; _j++) {
        i = uniqArray[_j];
        $("<option value='" + i + "'>" + i + "</option>").appendTo($(this.div));
      }
      currentDiv = this.div.find(":selected").text();
      return this.buildRCNC(currentDiv);
    };

    ChitChatSection.prototype.buildRCNC = function(div) {
      var data, v, _i, _len, _results;
      data = this.actList;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        v = data[_i];
        if (v[1] === div) {
          _results.push($("<option value='" + v[0] + "'>" + v[0] + "</option>").appendTo($(this.rcnc)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ChitChatSection.prototype.loadLocationList = function() {
      return this.onSelect(this.result);
    };

    ChitChatSection.prototype.saveActivityDetail = function() {
      return this.onSave(this.pass);
    };

    ChitChatSection.prototype.pass = function() {
      return console.info("success");
    };

    ChitChatSection.prototype.result = function(data) {
      this.actList = data;
      console.info(data);
      return this.buildDivision();
    };

    ChitChatSection.prototype.onSelect = function(andThen) {
      var postURL, req;
      req = {
        jsonClass: "FieldRequest",
        universe: "capris",
        table: "rcnc_table",
        column: "rc_name",
        criteria: {
          jsonClass: "ComparisonCriteria",
          operation: "starts-with",
          value: ""
        },
        pk: {
          table: "rcnc_table",
          column: "div_name"
        },
        security: {
          table: "rcnc_table",
          column: "cgd_id"
        },
        page: {
          offset: 0,
          length: 20
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

    ChitChatSection.prototype.onSave = function(andThen) {
      var activityItem, budget, convertDate, date, desc, ic, immi, onepa, org, part, postURL, title;
      title = $(this.activity).find(":selected").text();
      date = $(this.date).val();
      convertDate = $.datepicker.formatDate('yy-mm-dd', new Date(date));
      desc = $(this.desc).val();
      org = $(this.organiser).val();
      ic = $(this.ic).val();
      part = parseInt($(this.participants).val());
      immi = parseInt($(this.immigrants).val());
      budget = parseFloat($(this.budget).val());
      onepa = $(this.onepa).val();
      activityItem = {
        "title": title,
        "date": convertDate,
        "description": desc,
        "organiser": org,
        "staff": ic,
        "participants": part,
        "immigrants": immi,
        "budget": budget,
        "onepa": onepa
      };
      console.info(activityItem);
      postURL = cp.buildSafeUrl("/adhoc/integration/update/activity");
      return $.ajax({
        type: 'post',
        url: postURL,
        contentType: 'application/json',
        data: JSON.stringify(activityItem),
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
