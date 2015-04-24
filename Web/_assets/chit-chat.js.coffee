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
      if($(@form).valid() and $(@formUpload).valid())
        @formUpload.submit()
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
    @infoSpan.text("Saving...")
    item = {basic:[],number:[]}
    grc=''
    division=$("#div").val()
    rcnc=$("#rcnc").val()
    adviser=$("#adv").val()
    venue=$("#venue").val()
    faci=$("#faci").val()
    tour=$("#tour").val()
    phase1=$("#phase1").val()
    convertPhase1Date=$.datepicker.formatDate('yy-mm-dd', new Date(phase1))
    phase2=$("#phase2").val()
    convertPhase2Date=$.datepicker.formatDate('yy-mm-dd', new Date(phase2))
    remark=$("#remark").val()
    path=$("#upload-dialog-name")[0].files[0].name
    uploadURL="http://localhost:9080/elx/do/cpr/dc/content/"+path+"?elx.attachment"

    sg_part = parseInt($("#local-part").val())
    immi_part= parseInt($("#immi-part").val())
    foreigner_part=parseInt($("#fg-part").val())
    n_local_part = parseInt($("#n_local_part").val())
    n_india_part = parseInt($("#n_india_part").val())
    n_indo_part = parseInt($("#n_indo_part").val())
    n_ma_part = parseInt($("#n_malay_part").val())
    n_cn_part = parseInt($("#n_cn_part").val())
    n_philip_part = parseInt($("#n_ph_part").val())
    n_other_part = parseInt($("#n_other_part").val())
    n_other_remark = $("#n_other_remark").val()

    e_ma_part = parseInt($("#e-ma-part").val())
    e_in_part = parseInt($("#e-in-part").val())
    e_cn_part = parseInt($("#e-cn-part").val())
    e_other_part = parseInt($("#e-other-part").val())

    basicItem = new cp.BasicInfo(grc,division,rcnc,adviser,venue,faci,tour,convertPhase1Date,convertPhase2Date,remark)
    numberItem = new cp.NumberInfo(sg_part,immi_part,foreigner_part,n_cn_part,n_ma_part,n_india_part,n_local_part,n_indo_part,n_philip_part,n_other_part,n_other_remark,e_cn_part,e_ma_part,e_in_part,e_other_part,uploadURL)
    item.basic.push(basicItem)
    item.number.push(numberItem)
    #console.info(item)
    #termItem= new cp.TermInfo("TP","2013-08-31","2015-09-30","http://google.com",1)
    #console.info(termItem)
    postURL = cp.buildSafeUrl("/adhoc/chitchat/update/chit-chat-activity")
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


class BasicInfo
  constructor:(@cs_code,@div_code,@rc_code,@adviser,@venue,@faci,@tour,@phase1_date,@phase2_date,@remark)->

class NumberInfo
  constructor:(@ci_local_part,@ci_imm_part,@ci_for_part,@co_china_part,@co_malaysia_part,@co_india_part,@co_sing_part,@co_indonesia_part,@co_philip_part,@co_other_part,@co_other_remark,@et_chinese_part,@et_malay_part,@et_indian_part,@et_other_part,@url)->

cp.BasicInfo=BasicInfo
cp.NumberInfo=NumberInfo
cp.ChitChatSection=ChitChatSection

