(function() {
  var IntegrationEngagement,
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

  IntegrationEngagement = (function() {
    function IntegrationEngagement() {
      this.result = __bind(this.result, this);
      this.pass = __bind(this.pass, this);
      this.saveActivityDetail = __bind(this.saveActivityDetail, this);
      this.loadActivityList = __bind(this.loadActivityList, this);
      this.buildActivitySelection = __bind(this.buildActivitySelection, this);
      this.fillActivity = __bind(this.fillActivity, this);
      var cred;
      cred = cp.credentials;
      this.contents = $("#integration-engagement-contents");
      this.fillActivity();
    }

    IntegrationEngagement.prototype.fillActivity = function() {
      var button, currentDate, form, preYear, year;
      this.actList = [];
      this.loadActivityList();
      currentDate = new Date();
      this.currentYear = currentDate.getFullYear();
      preYear = this.currentYear - 1;
      this.div = $("<div style='max-height: 800px; overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(this.contents);
      form = new cp.HorizontalBootstrapForm(this.div);
      year = form.selectRow("Year");
      this.activity = form.selectRow("Activity Title");
      $("<option value='" + this.currentYear + "'>" + this.currentYear + "</option>").appendTo($(year));
      $("<option value='" + preYear + "'>" + preYear + "</option>").appendTo($(year));
      this.date = form.inputRow("Date", "", 100);
      $(this.date).datepicker({
        dateFormat: 'dd-mm-yy'
      });
      this.desc = form.inputRow("Activity Description", "", 100);
      this.organiser = form.inputRow("Main Organiser", "", 100);
      this.ic = form.inputRow("Staff IC", "", 100);
      this.participants = form.inputRow("Number of Participants (A)", "", 100);
      this.immigrants = form.inputRow("Number of New Immigrants Engaged (B)", "", 100);
      this.budget = form.inputRow("Budget Spent", "", 100);
      this.onepa = form.inputRow("OnePA Activity Code", "", 100);
      button = form.buttonRow("Submit");
      this.infoSpan = $("<p style='display:inline;margin-left:8px; color:red'></p>").insertAfter(button);
      button.click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.saveActivityDetail();
        };
      })(this));
      return $(year).on("change", (function(_this) {
        return function() {
          var yearSel;
          _this.activity.empty();
          yearSel = $(year).find(":selected").text();
          return _this.buildActivitySelection(yearSel);
        };
      })(this));
    };

    IntegrationEngagement.prototype.buildActivitySelection = function(yearsel) {
      var data, v, _i, _len, _results;
      data = this.actList;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        v = data[_i];
        if (parseInt(v["year"]) === parseInt(yearsel)) {
          _results.push($("<option value='" + v["title"] + "'>" + v["title"] + "</option>").appendTo($(this.activity)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    IntegrationEngagement.prototype.loadActivityList = function() {
      return this.onSelect(this.result);
    };

    IntegrationEngagement.prototype.saveActivityDetail = function() {
      return this.onSave(this.pass);
    };

    IntegrationEngagement.prototype.pass = function() {
      this.infoSpan.text("Save Successfully");
      window.setTimeout(((function(_this) {
        return function() {
          return _this.infoSpan.text("");
        };
      })(this)), 4000);
      return console.info("success");
    };

    IntegrationEngagement.prototype.result = function(data) {
      this.actList = data;
      return this.buildActivitySelection(this.currentYear);
    };

    IntegrationEngagement.prototype.onSelect = function(andThen) {
      var postURL;
      postURL = cp.buildSafeUrl("/adhoc/integration/get/activity");
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

    IntegrationEngagement.prototype.onSave = function(andThen) {
      var activityItem, budget, convertDate, date, desc, ic, immi, onepa, org, part, postURL, title;
      this.infoSpan.text("Saving...");
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

    return IntegrationEngagement;

  })();

  cp.IntegrationEngagement = IntegrationEngagement;

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
