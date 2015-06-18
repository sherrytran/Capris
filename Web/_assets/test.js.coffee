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

class ChitChatSection
  constructor: () ->
   	cred=cp.credentials
    @contents = $("#chit-chat-section-contents")
    @fillChitChat()


  fillChitChat: () =>
    url = cp.buildSafeUrl("/dc/content/CPR") + "?action=upload"
    @actList=[]
    @loadLocationList()
    @form=$("#chitchat-form")
    #@div = $("<div style='overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(@contents)
    table=$("#first-table")
    $("#phase1").datepicker({
      dateFormat: 'dd/mm/yy'
    })
    $("#phase2").datepicker({
      dateFormat: 'dd/mm/yy'
    })

    table3=$("<table class='table table-responsive'></table>").insertAfter(table)
    tr1=$("<tr></tr>").appendTo(table3);
    $("<td colspan='2'  align='center'><h2>Citizen Type</h2></td>").appendTo(tr1);
    $("<tr><th></th><th>Participant(s)</th>").appendTo(table3)
    $("<tr><th>Locals *</th><td><input id='local-part' name='localpart' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>New Immigrants *</th><td><input id='immi-part' name='immipart' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>Foreigners *</th><td><input id='fg-part' name='fgpart' class='form-control input-sm' type='text'></td>").appendTo(table3)

    tr3=$("<tr></tr>").appendTo(table3);
    $("<td colspan='2' align='center'><h2>Country Of Birth</h2></td>").appendTo(tr3);
    $("<tr><th>Singapore *</th><td><input id='n_local_part' name='n_local_part' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>India *</th><td><input id='n_india_part' name='n_india_part' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>Indonesia *</th><td><input id='n_indo_part' name='n_indo_part' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>Malaysia *</th><td><input id='n_malay_part' name='n_malay_part' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>People Republic Of China *</th><td><input id='n_cn_part' name='n_cn_part' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>Philippines *</th><td><input id='n_ph_part' name='n_ph_part' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>Others *</th><td><input id='n_other_part' name='n_other_part' class='form-control input-sm' type='text'></td><td>Please State e.g (2 British, 1 Korean):</td><td><input id='n_other_remark' class='form-control input-sm' type='text'></td>").appendTo(table3)


    tr5=$("<tr></tr>").appendTo(table3);
    $("<td colspan='2' align='center'><h2>Ethnic</h2></td>").appendTo(tr5);
    $("<tr><th>Chinese *</th><td><input id='e-cn-part' name='ecnpart' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>Malay *</th><td><input id='e-ma-part' name='emapart' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>Indian *</th><td><input id='e-in-part' name='einpart' class='form-control input-sm' type='text'></td>").appendTo(table3)
    $("<tr><th>Others *</th><td><input id='e-other-part' name='eotherpart' class='form-control input-sm' type='text'></td>").appendTo(table3)

    @formUpload =  $("<form id='upload-dialog-form' action='#{url}' enctype='multipart/form-data' method='post' name='upload' target='upload-iframe' />").insertAfter(@form)
    $("<input id='upload-dialog-name' name='uploadFile' type='file' name='file'/>").appendTo(@formUpload)
    $("<iframe id='upload-iframe' name='upload-iframe' src='' style='width:0;height:0;border:0px solid #fff;'></iframe>").insertAfter(table3)
    @breakpoint=$("<br>").insertAfter(@formUpload)
    @button=$("<button class='btn btn-primary'>Submit</button>").insertAfter(@breakpoint)
    @infoSpan = $("<p style='display:inline;margin-left:8px'></p>").insertAfter(@button)
    @button.click (e) =>
      e.preventDefault()
      @saveActivityDetail()


    $("#div").on "change", =>
      $("#rcnc").empty()
      @currentDiv=$("#div").val()
      @onLoadLocation(@currentDiv,@buildRCNC)

  validate: () =>
    $(@formUpload).validate({
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
    })

    $(@form).validate({
      rules: {
        advisor: {
          required: true
        },
        venue: {
          required: true
        },
        phase1date: {
          required: true
          anyDate:true
        },
        faci: {
          required: true
        },
        cljtour: {
          required: true
        },
        phase2date: {
          anyDate:true
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
    })

  buildGRC:(data)=>
    valueToString = (v) -> v.toString()
    arr2 = _.uniq(data, false, valueToString)
    for c in arr2
      $("<option value='#{c[0]}'>#{c[1]}</option>").appendTo($("#grc"))

    @currentGRC=$("#grc").val()
    @onLoadLocation(@currentGRC,@buildDivision)


  buildDivision:(data)=>
    valueToString = (v) -> v.toString()
    arr3 = _.uniq(data, false, valueToString)
    for c in arr3
      $("<option value='#{c[0]}'>#{c[1]}</option>").appendTo($("#div"))
    @currentDiv=$("#div").val()
    @onLoadLocation(@currentDiv,@buildRCNC)

  buildRCNC:(data)=>
    for v in data
      $("<option value='#{v.rc_code}'>#{v.rc_name}</option>").appendTo($("#rcnc"))

  loadLocationList:()=>
    @onSelect(@buildDivision,"c_cdd_cs_div","div_code","div_name")

  secureDivision:(data)=>
    data
    @filterDiv = data

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

  onLoadLocation: (div,andThen)->
    postURL = cp.buildSafeUrl("/adhoc/chitchat/get/chit-chat-location/#{div}")
    console.info(postURL)
    $.ajax({
      type: 'get'
      url: postURL
      data: 'json'
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)
    })

  onSave: (andThen)->
    #basicItem = new cp.BasicInfo("testing","2014-03-14","10:00:00","12:00:00","desc","AH","RM",2,3,["S1234B","S456"])
    #termItem= new cp.TermInfo("TP","2013-08-31","2015-09-30","http://google.com",1)
    itemAct={items:[],title:"testing",date:"2014-03-14",startTime:"10:00:00",endTime:"12:00:00",desc:"desc",divCode:"AH",rcCode:"RM",preRemind:2,postRemind:3,nric:["S1234B","S456"]}
    activity=new cp.ActivityItems("S1234B","04","211","1234","2014-04-13")
    itemAct.items.push(activity)
    activity2=new cp.ActivityItems("S1234C","04","211","1234","2014-04-14")
    itemAct.items.push(activity2)
    postURL = cp.buildSafeUrl("/adhoc/web/update/house-visit-activity-plan")
    $.ajax({
      type: 'post'
      url: postURL
      contentType: 'application/json'
      data: JSON.stringify(itemAct)
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)
    })

class ActivityItems
  constructor:(@nric,@floorNo,@unitNo,@postalCode,@reg_date)->

class BasicInfo
  constructor:(@title,@date,@startTime,@endTime,@desc,@divCode,@rcCode,@preRemind,@postRemind,@nric)->

cp.BasicInfo=BasicInfo
cp.ActivityItems=ActivityItems
cp.ChitChatSection=ChitChatSection

