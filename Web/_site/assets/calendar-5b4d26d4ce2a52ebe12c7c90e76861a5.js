(function() {
  var Calendar, CalendarItem,
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

  $.validator.addMethod('greaterThan', (function(value, element, params) {
    if (!/Invalid|NaN/.test(new Date(value))) {
      return new Date(value) > new Date($(params).val());
    }
    return isNaN(value) && isNaN($(params).val()) || Number(value) > Number($(params).val());
  }), 'Must be greater than Start Date.');

  $.validator.addMethod('anyDate', (function(value, element) {
    return value.match(/^(0?[1-9]|[12][0-9]|3[0-1])[/](0?[1-9]|1[0-2])[/](19|20)?\d{2}$/);
  }), 'Please enter a valid date dd/mm/yyyy');

  Calendar = (function() {
    function Calendar() {
      this.result = __bind(this.result, this);
      this.validate = __bind(this.validate, this);
      this.test = __bind(this.test, this);
      this.fillCalendar = __bind(this.fillCalendar, this);
      var cred;
      cred = cp.credentials;
      this.contents = $("#sp-calendar-contents");
      this.form = $("#calendar-form");
      this.calendar = [];
      this.fillCalendar();
    }

    Calendar.prototype.fillCalendar = function() {
      var tr;
      this.table = $("#first-table");
      tr = $("<tr></tr>").appendTo(this.table);
      $("<tr><th>Title*: </th><td><input maxlength='30' id='title' name='title' class='form-control input-sm' type='text'></td>").appendTo(this.table);
      $("<tr><th>Description*:</th><td><textarea maxlength='150' id='description' name='description' class='form-control input-sm' type='text'></textarea></td>").appendTo(this.table);
      $("<tr><th>Start Date: </th><td><input id='startdate' name='startdate' class='form-control input-sm' type='text' readonly></td>").appendTo(this.table);
      $("<tr><th>End Date: </th><td><input id='enddate' name='enddate' class='form-control input-sm' type='text' readonly></td>").appendTo(this.table);
      $("<tr><th>Start Time: </th><td><input id='starttime' name='starttime' class='form-control input-sm' type='text' readonly></td>").appendTo(this.table);
      $("<tr><th>End Time: </th><td><input id='endtime' name='endtime' class='form-control input-sm' type='text' readonly></td>").appendTo(this.table);
      $("<tr><th>Repeat Frequency</th><td><select id='frequency' class='form-control input-sm'></td>").appendTo(this.table);
      $("<option value='None'>None</option><option value='Daily'>Daily</option><option value='Monthly'>Monthly</option><option value='Yearly'>Yearly</option>").appendTo($("#frequency"));
      this.submit = $("<button class='btn btn-primary'>Submit</button>").appendTo(this.table);
      $("#startdate").datepicker({
        dateFormat: 'dd/mm/yy'
      });
      $("#enddate").datepicker({
        dateFormat: 'dd/mm/yy'
      });
      $("#starttime").timepicker();
      $("#endtime").timepicker();
      return this.submit.click((function(_this) {
        return function(e) {
          e.preventDefault();
          if ($(_this.form).valid()) {
            return _this.test();
          }
        };
      })(this));
    };

    Calendar.prototype.test = function() {
      return this.onSave(this.result);
    };

    Calendar.prototype.onSave = function(andThen) {
      var convertEnd, convertStart, desc, end, endTime, item, parseEnd, parseStart, postURL, repeat_frequency, start, startTime, title;
      title = $("#title").val();
      desc = $("#description").val();
      start = $("#startdate").val();
      parseStart = $.datepicker.parseDate('dd/mm/yy', start);
      convertStart = $.datepicker.formatDate('yy-mm-dd', parseStart);
      end = $("#enddate").val();
      parseEnd = $.datepicker.parseDate('dd/mm/yy', end);
      convertEnd = $.datepicker.formatDate('yy-mm-dd', parseEnd);
      startTime = $("#starttime").val();
      endTime = $("#endtime").val();
      repeat_frequency = $("#frequency").val();
      item = new CalendarItem(title, desc, convertStart, convertEnd, startTime, endTime, true, repeat_frequency);
      postURL = cp.buildSafeUrl("/adhoc/web/update/calendar");
      return $.ajax({
        type: 'post',
        url: postURL,
        contentType: 'application/json',
        data: JSON.stringify(item),
        success: andThen,
        error: (function(_this) {
          return function(jqXHR, textStatus, errorThrown) {
            var msg;
            console.info(textStatus);
            console.info(jqXHR);
            msg = jqXHR.responseText;
            if (msg.indexOf("Duplicate") > -1) {
              alert("Your title has already existed");
            }
            return console.info(errorThrown);
          };
        })(this)
      });
    };

    Calendar.prototype.validate = function() {
      return $(this.form).validate({
        rules: {
          title: {
            required: true
          },
          startdate: {
            anyDate: true,
            required: true
          },
          enddate: {
            anyDate: true,
            required: true,
            greaterThan: "#startdate"
          }
        },
        messages: {
          title: {
            required: "You need to enter a title"
          },
          startdate: {
            required: "You need to select Start Date"
          },
          enddate: {
            required: "You need to select End Date"
          }
        }
      });
    };

    Calendar.prototype.result = function() {
      console.info("done");
      return alert("Submit Successfully");
    };

    return Calendar;

  })();

  CalendarItem = (function() {
    function CalendarItem(title, description, start_date, end_date, start_time, end_time, recur, repeat_frequency) {
      this.title = title;
      this.description = description;
      this.start_date = start_date;
      this.end_date = end_date;
      this.start_time = start_time;
      this.end_time = end_time;
      this.recur = recur;
      this.repeat_frequency = repeat_frequency;
    }

    return CalendarItem;

  })();

  cp.Calendar = Calendar;

}).call(this);
