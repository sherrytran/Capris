(function() {
  var CssGccSection, Item,
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

  CssGccSection = (function() {
    function CssGccSection() {
      this.pass = __bind(this.pass, this);
      this.saveActivityDetail = __bind(this.saveActivityDetail, this);
      this.loadLocationList = __bind(this.loadLocationList, this);
      this.buildDivision = __bind(this.buildDivision, this);
      this.validate = __bind(this.validate, this);
      this.fillCssGcc = __bind(this.fillCssGcc, this);
      var cred;
      cred = cp.credentials;
      this.contents = $("#css-gcc-contents");
      this.fillCssGcc();
    }

    CssGccSection.prototype.fillCssGcc = function() {
      var table, url;
      url = cp.buildSafeUrl("/dc/content/CPR") + "?action=upload";
      this.actList = [];
      this.loadLocationList();
      this.form = $("#css-gcc-form");
      table = $("#first-table");
      $("#actDate").datepicker({
        dateFormat: 'dd/mm/yy'
      });
      $("#start").timepicker();
      $("#end").timepicker();
      this.breakpoint = $("<br>").insertAfter(this.form);
      this.button = $("<button class='btn btn-primary'>Submit</button>").insertAfter(this.breakpoint);
      this.infoSpan = $("<p style='display:inline;margin-left:8px'></p>").insertAfter(this.button);
      return this.button.click((function(_this) {
        return function(e) {
          e.preventDefault();
          if ($(_this.form).valid()) {
            return _this.saveActivityDetail();
          }
        };
      })(this));
    };

    CssGccSection.prototype.validate = function() {
      return $(this.form).validate({
        rules: {
          desc: {
            required: true
          },
          actDate: {
            required: true,
            anyDate: true
          },
          start: {
            required: true,
            time: true
          },
          end: {
            required: true,
            time: true
          },
          venue: {
            required: true
          },
          goh: {
            required: true
          },
          seat: {
            required: true,
            number: true
          },
          staff: {
            required: true
          },
          re: {
            required: true
          }
        },
        messages: {
          desc: {
            required: "Please enter an activity description"
          },
          actDate: {
            required: "Please enter an activity date"
          },
          start: {
            required: "Please enter start time"
          },
          end: {
            required: "Please enter start time"
          },
          venue: {
            required: "Please enter a venue"
          },
          goh: {
            required: "Please enter a GOH/Speaker"
          },
          seat: {
            required: "Please enter a seating capacity",
            number: "Please enter a valid number"
          },
          staff: {
            required: "Please enter staff in charge"
          },
          re: {
            required: "Please enter ccc reimbursement"
          }
        }
      });
    };

    CssGccSection.prototype.buildDivision = function(data) {
      var arr3, c, valueToString, _i, _len, _results;
      valueToString = function(v) {
        return v.toString();
      };
      arr3 = _.uniq(data, false, valueToString);
      _results = [];
      for (_i = 0, _len = arr3.length; _i < _len; _i++) {
        c = arr3[_i];
        _results.push($("<option value='" + c[0] + "'>" + c[1] + "</option>").appendTo($("#div")));
      }
      return _results;
    };

    CssGccSection.prototype.loadLocationList = function() {
      return this.onSelect(this.buildDivision, "c_cdd_cs_div", "div_code", "div_name");
    };

    CssGccSection.prototype.saveActivityDetail = function() {
      return this.onSave(this.pass);
    };

    CssGccSection.prototype.pass = function() {
      console.info("success");
      this.infoSpan.text("Save Successfully");
      return window.setTimeout(((function(_this) {
        return function() {
          return _this.infoSpan.text("");
        };
      })(this)), 4000);
    };

    CssGccSection.prototype.onSelect = function(andThen, table, col1, col2) {
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

    CssGccSection.prototype.onSave = function(andThen) {
      var actDate, convertDate, delivery, description, division, endTime, goh, item, meal, postURL, re, seat, staff, startTime, type, venue;
      this.infoSpan.text("Saving...");
      type = $("#type").val();
      division = $("#div").val();
      description = $("#desc").val();
      actDate = $("#actDate").val();
      convertDate = $.datepicker.formatDate('yy-mm-dd', new Date(actDate));
      startTime = $("#start").val();
      endTime = $("#end").val();
      venue = $("#venue").val();
      goh = $("#goh").val();
      seat = parseInt($("#seat").val());
      staff = $("#staff").val();
      re = $("#re").val();
      meal = $("#meal").val();
      delivery = $("#delivery").val();
      item = new cp.Item(type, division, description, convertDate, startTime, endTime, venue, goh, seat, staff, re, meal, delivery);
      console.info(item);
      postURL = cp.buildSafeUrl("/adhoc/chitchat/update/css-gcc-activity");
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

    return CssGccSection;

  })();

  Item = (function() {
    function Item(actType, div, desc, date, start, end, venue, goh, seat, staff, re, meal, delivery) {
      this.actType = actType;
      this.div = div;
      this.desc = desc;
      this.date = date;
      this.start = start;
      this.end = end;
      this.venue = venue;
      this.goh = goh;
      this.seat = seat;
      this.staff = staff;
      this.re = re;
      this.meal = meal;
      this.delivery = delivery;
    }

    return Item;

  })();

  cp.Item = Item;

  cp.CssGccSection = CssGccSection;

}).call(this);
