cp.buildSafeUrl = (path,query)->
  sb = "/cpr"
  parts = path.split("/")
  for part in parts
    if (part.length>0)
      sb += ("/" + encodeURIComponent(part))
  sb + (query || "")

$.validator.addMethod 'greaterThan', ((value, element, params) ->
  if !/Invalid|NaN/.test(new Date(value))
    return new Date(value) > new Date($(params).val())
  isNaN(value) and isNaN($(params).val()) or Number(value) > Number($(params).val())
), 'Must be greater than Start Date.'

$.validator.addMethod 'anyDate', ((value, element) ->
  value.match /^(0?[1-9]|[12][0-9]|3[0-1])[/](0?[1-9]|1[0-2])[/](19|20)?\d{2}$/
), 'Please enter a valid date dd/mm/yyyy'

class Calendar
  constructor: () ->
   	cred=cp.credentials
    @contents = $("#sp-calendar-contents")
    @form=$("#calendar-form")
    @calendar = []
    @fillCalendar()

  fillCalendar: ()=>
    @table = $("#first-table")
    tr=$("<tr></tr>").appendTo(@table);
    $("<tr><th>Title*: </th><td><input maxlength='30' id='title' name='title' class='form-control input-sm' type='text'></td>").appendTo(@table)
    $("<tr><th>Description*:</th><td><textarea maxlength='150' id='description' name='description' class='form-control input-sm' type='text'></textarea></td>").appendTo(@table)
    $("<tr><th>Start Date: </th><td><input id='startdate' name='startdate' class='form-control input-sm' type='text' readonly></td>").appendTo(@table)
    $("<tr><th>End Date: </th><td><input id='enddate' name='enddate' class='form-control input-sm' type='text' readonly></td>").appendTo(@table)
    $("<tr><th>Start Time: </th><td><input id='starttime' name='starttime' class='form-control input-sm' type='text' readonly></td>").appendTo(@table)
    $("<tr><th>End Time: </th><td><input id='endtime' name='endtime' class='form-control input-sm' type='text' readonly></td>").appendTo(@table)
    $("<tr><th>Repeat Frequency</th><td><select id='frequency' class='form-control input-sm'></td>").appendTo(@table)
    $("<option value='None'>None</option><option value='Daily'>Daily</option><option value='Monthly'>Monthly</option><option value='Yearly'>Yearly</option>").appendTo($("#frequency"))
    @submit=$("<button class='btn btn-primary'>Submit</button>").appendTo(@table)
    $("#startdate").datepicker({dateFormat:'dd/mm/yy'})
    $("#enddate").datepicker({dateFormat:'dd/mm/yy'})
    $("#starttime").timepicker()
    $("#endtime").timepicker()
    @submit.click (e) =>
      e.preventDefault()
      if($(@form).valid())
        @test()

  test: ()=>
    @onSave(@result)

  onSave: (andThen)->
    title=$("#title").val()
    desc=$("#description").val()
    start=$("#startdate").val()
    parseStart=$.datepicker.parseDate('dd/mm/yy',start)
    convertStart=$.datepicker.formatDate('yy-mm-dd', parseStart)
    end=$("#enddate").val()
    parseEnd=$.datepicker.parseDate('dd/mm/yy',end)
    convertEnd=$.datepicker.formatDate('yy-mm-dd', parseEnd)
    startTime=$("#starttime").val()
    endTime=$("#endtime").val()
    #recur=$("#repeat").is(':checked')
    repeat_frequency = $("#frequency").val()
    item= new CalendarItem(title,desc,convertStart,convertEnd,startTime,endTime,true,repeat_frequency)
    postURL = cp.buildSafeUrl("/adhoc/web/update/calendar")
    $.ajax({
      type: 'post'
      url: postURL
      contentType: 'application/json'
      data: JSON.stringify(item)
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        msg = jqXHR.responseText
        if msg.indexOf("Duplicate")>-1
          alert("Your title has already existed")
        console.info(errorThrown)


    })

  validate:()=>
    $(@form).validate({
      rules: {
        title: {
          required: true
        },
        startdate:{
          anyDate:true
          required: true
        },
        enddate:{
          anyDate:true
          required:true
          greaterThan: "#startdate"
        }
      },
      messages: {
        title: {
          required: "You need to enter a title"
        },
        startdate:{
          required: "You need to select Start Date"
        },
        enddate:{
          required:"You need to select End Date"
        }
      }
    })

  result: ()=>
    console.info("done")
    alert("Submit Successfully")

class CalendarItem
  constructor: (@title,@description,@start_date,@end_date,@start_time,@end_time,@recur,@repeat_frequency) ->

cp.Calendar=Calendar
