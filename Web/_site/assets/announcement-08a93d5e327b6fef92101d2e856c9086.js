(function() {
  var ReportCate;

  ReportCate = (function() {
    function ReportCate() {
      var cred;
      cred = cp.credentials;
      console.info(cred);
      $("a#user").text("Welcome, " + cred.username);
      if (cred.username !== "admin") {
        $("#areportdiv").hide();
        $("#breportdiv").hide();
        $("#areport").hide();
        $("#breport").hide();
        $("#log").hide();
      }
    }

    return ReportCate;

  })();

  $(document).ready(function() {
    return new ReportCate();
  });

}).call(this);

(function() {
  var Announcements,
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

  Announcements = (function() {
    function Announcements() {
      this.result = __bind(this.result, this);
      this.test = __bind(this.test, this);
      this.fillAnnouncements = __bind(this.fillAnnouncements, this);
      var cred;
      cred = cp.credentials;
      this.contents = $("#sp-announcements-contents");
      this.announcements = [];
      this.fillAnnouncements();
    }

    Announcements.prototype.fillAnnouncements = function() {
      var add, data, footerForm, headerForm, save;
      this.contents.empty();
      headerForm = new cp.HorizontalBootstrapForm(this.contents, cp.HorizontalBootstrapForm.OneElevenOptions());
      add = headerForm.buttonRow("Add Announcement");
      add.removeClass("btn-primary");
      add.click(this.onAdd);
      this.div = $("<div style='max-height: 800px; overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(this.contents);
      footerForm = new cp.HorizontalBootstrapForm(this.contents);
      save = footerForm.buttonRow("Save Changes");
      this.infoSpan = $("<span style='margin-left: 10px;'></span>").insertAfter(save);
      save.click(this.test);
      data = [
        {
          "title": "BizInsights Maintenance 22/8",
          "line1": "Update will start from 6:45pm to"
        }, {
          "title": "Credit Card Maintenance",
          "line1": "Credit Card facilities "
        }, {
          "title": "BizInsights Maintenance 29/7",
          "line1": "Update will start from 6:30pm to"
        }, {
          "title": "BizInsights is now Live!",
          "line1": "Please log in with your new"
        }
      ];
      return this.buildAnnouncements(data);
    };

    Announcements.prototype.test = function() {
      return this.onSave(this.result);
    };

    Announcements.prototype.onSave = function(andThen) {
      var postURL;
      console.info("click click");
      postURL = cp.buildSafeUrl("/adhoc/web/update-hv/1234567");
      return $.ajax({
        type: 'post',
        url: postURL,
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

    Announcements.prototype.result = function() {
      return console.info("done");
    };

    Announcements.prototype.buildAnnouncements = function(as) {
      var a, model, _i, _len, _results;
      this.announcements = [];
      _results = [];
      for (_i = 0, _len = as.length; _i < _len; _i++) {
        a = as[_i];
        model = this.buildModel(a);
        _results.push(this.announcements.push(model));
      }
      return _results;
    };

    Announcements.prototype.buildModel = function(a) {
      var box, fields, form, model, _ref;
      model = {
        data: a
      };
      box = $("<div></div>").appendTo(this.div);
      box.css("margin-bottom", "30px").css("border-bottom", "1px solid #CCC");
      form = new cp.HorizontalBootstrapForm(box);
      fields = {};
      _ref = form.inputRowWithButton("Title", a.title || "", 32, "Delete"), fields.title = _ref[0], model["delete"] = _ref[1];
      fields.line1 = form.inputRow("Line 1", a.line1 || "", 100);
      model.up = $("<button class='btn'><span title='Move Up' class='glyphicon glyphicon-arrow-up'></span></btn>").insertBefore(model["delete"]);
      model.down = $("<button class='btn'><span title='Move Down' class='glyphicon glyphicon-arrow-down'></span></btn>").insertBefore(model.up);
      model.box = box;
      model.fields = fields;
      model.up.click(model, this.onUp);
      model.down.click(model, this.onDown);
      model["delete"].click(model, this.onDelete);
      return model;
    };

    return Announcements;

  })();

  cp.Announcements = Announcements;

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
