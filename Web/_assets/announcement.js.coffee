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

class Announcements
  constructor: () ->
   	cred=cp.credentials
    @contents = $("#sp-announcements-contents")
    @form=$("#announcement-form")
    @announcements = []
    @fillAnnouncements()

  fillAnnouncements: ()=>
    @table = $("#first-table")
    tr=$("<tr></tr>").appendTo(@table);
    $("<tr><th>Title*: </th><td><input maxlength='30' id='title' name='title' class='form-control input-sm' type='text'></td>").appendTo(@table)
    $("<tr><th>Description*: </th><td><textarea maxlength='150' id='description' name='description' class='form-control input-sm' type='text'></textarea></td>").appendTo(@table)
    $("<tr><th>Start Date: </th><td><input id='startdate' name='startdate' class='form-control input-sm' type='text'></td>").appendTo(@table)
    $("<tr><th>End Date: </th><td><input id='enddate' name='enddate' class='form-control input-sm' type='text'></td>").appendTo(@table)
    #$("<tr><th>Repeat</th><td><input id='repeat' type='checkbox'></td>").appendTo(@table)
    $("<tr><th>Repeat Frequency: </th><td><select id='frequency' class='form-control input-sm'></td>").appendTo(@table)
    $("<option value='None'>None</option><option value='Daily'>Daily</option><option value='Monthly'>Monthly</option><option value='Yearly'>Yearly</option>").appendTo($("#frequency"))
    @submit=$("<button class='btn btn-primary'>Submit</button>").appendTo(@table)
    $("#startdate").datepicker({dateFormat:'dd/mm/yy'})
    $("#enddate").datepicker({dateFormat:'dd/mm/yy'})
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
    #recur=$("#repeat").is(':checked')
    repeat_frequency = $("#frequency").val()
    item= new AnnouncementItem(title,desc,convertStart,convertEnd,true,repeat_frequency)
    postURL = cp.buildSafeUrl("/adhoc/web/update/announcement")
    $.ajax({
      type: 'post'
      url: postURL
      contentType: 'application/json'
      data: JSON.stringify(item)
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        msg = jqXHR.responseText
        if msg.indexOf("Duplicate")>-1
          alert("Your title has already existed")
    })

  validate:()=>
    $(@form).validate({
      rules: {
        title: {
          required: true
        },
        description:{
          required: true
        }
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
        description:{
          required: "You need to enter a description"
        }
        startdate:{
          required: "You need to select Start Date"
        },
        enddate:{
          required:"You need to select End Date"
        }
      }
    })

  result: ()=>
    alert("Submit Successfully")

class AnnouncementItem
  constructor: (@title,@description,@start_date,@end_date,@recur,@repeat_frequency) ->

cp.Announcements=Announcements
