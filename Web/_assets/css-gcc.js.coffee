cp.buildSafeUrl = (path,query)->
  sb = "/cpr"
  parts = path.split("/")
  for part in parts
    if (part.length>0)
      sb += ("/" + encodeURIComponent(part))
  sb + (query || "")

$.validator.addMethod 'anyDate', ((value, element) ->
  value.match /^(0?[1-9]|[12][0-9]|3[0-1])[/](0?[1-9]|1[0-2])[/](19|20)?\d{2}$/
), 'Please enter a valid date dd/mm/yyyy'

$.validator.addMethod 'greaterThan', ((value, element, params) ->
  if !/Invalid|NaN/.test(new Date(value))
    return new Date(value) > new Date($(params).val())
  isNaN(value) and isNaN($(params).val()) or Number(value) > Number($(params).val())
), 'Must be greater than {0}.'

$.validator.addMethod 'time', ((value, element) ->
  @optional(element) or /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i.test(value)
), 'Please enter a valid time.'

class CssGccSection
  constructor: () ->
   	cred=cp.credentials
    @contents = $("#css-gcc-contents")
    @fillCssGcc()

  fillCssGcc: () =>
    url = cp.buildSafeUrl("/dc/content/CPR") + "?action=upload"
    @actList=[]
    @loadLocationList()
    @form=$("#css-gcc-form")
    table=$("#first-table")
    $("#actDate").datepicker({
      dateFormat: 'dd/mm/yy'
    })
    $("#start").timepicker()
    $("#end").timepicker()
    @breakpoint=$("<br>").insertAfter(@form)
    @button=$("<button class='btn btn-primary'>Submit</button>").insertAfter(@breakpoint)
    @infoSpan = $("<p style='display:inline;margin-left:8px'></p>").insertAfter(@button)
    @button.click (e) =>
      e.preventDefault()
      if($(@form).valid())
        @saveActivityDetail()


  validate: () =>
    $(@form).validate({
      rules: {
        desc: {
          required: true
        },
        actDate: {
          required: true
          anyDate: true
        },
        start: {
          required: true
          time:true
        },
        end: {
          required: true
          time:true
        },
        venue: {
          required: true
        },
        goh: {
          required: true
        },
        seat: {
          required: true
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
          required: "Please enter a seating capacity"
          number: "Please enter a valid number"
        },
        staff: {
          required: "Please enter staff in charge"
        },
        re: {
          required: "Please enter ccc reimbursement"

        }

      }
    })


  buildDivision:(data)=>
    valueToString = (v) -> v.toString()
    arr3 = _.uniq(data, false, valueToString)
    for c in arr3
      $("<option value='#{c[0]}'>#{c[1]}</option>").appendTo($("#div"))

  loadLocationList:()=>
    @onSelect(@buildDivision,"c_cdd_cs_div","div_code","div_name")

  saveActivityDetail:()=>
    @onSave(@pass)

  pass: ()=>
    console.info("success");
    @infoSpan.text("Save Successfully")
    window.setTimeout(( =>@infoSpan.text("")),4000)

  onSelect: (andThen,table,col1,col2)->
    req =
      jsonClass: "FieldRequest"
      universe: "capris"
      table: table
      column: col1
      criteria:
        jsonClass: "ComparisonCriteria"
        operation: "starts-with"
        value: ""
      pk:
        table: table
        column: col2
      security:
        table: table
        column: "cgd_id"
      page:
        offset: 0
        length: 0
      mimeType:
        value: "application/json"

    postURL = cp.buildSafeUrl("/uv/universe/capris")
    $.ajax({
      type: 'post'
      url: postURL
      data: JSON.stringify(req)
      contentType: "application/json"
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)
    })

  onSave: (andThen)->
    @infoSpan.text("Saving...")
    type=$("#type").val()
    division=$("#div").val()
    description=$("#desc").val()
    actDate=$("#actDate").val()
    convertDate=$.datepicker.formatDate('yy-mm-dd', new Date(actDate))
    startTime=$("#start").val()
    endTime=$("#end").val()
    venue=$("#venue").val()
    goh=$("#goh").val()
    seat=parseInt($("#seat").val())
    staff=$("#staff").val()
    re=$("#re").val()
    meal=$("#meal").val()
    delivery=$("#delivery").val()
    item = new cp.Item(type,division,description,convertDate,startTime,endTime,venue,goh,seat,staff,re,meal,delivery)
    console.info(item)
    #item = new cp.Item("CSS","AH","something","2015-01-01","09:00:00","08:00:00","a","b",100,"d","100","test","t")
    postURL = cp.buildSafeUrl("/adhoc/chitchat/update/css-gcc-activity")
    $.ajax({
      type: 'post'
      url: postURL
      contentType: 'application/json'
      data: JSON.stringify(item)
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)
    })


class Item
  constructor:(@actType,@div,@desc,@date,@start,@end,@venue,@goh,@seat,@staff,@re,@meal,@delivery)->


cp.Item=Item
cp.CssGccSection=CssGccSection

