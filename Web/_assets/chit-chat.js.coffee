cp.buildSafeUrl = (path,query)->
  sb = "/cpr"
  parts = path.split("/")
  for part in parts
    if (part.length>0)
      sb += ("/" + encodeURIComponent(part))
  sb + (query || "")

class ChitChatSection
  constructor: () ->
   	cred=cp.credentials
    @contents = $("#chit-chat-section-contents")
    @fillChitChat()


  fillChitChat: () =>
    url = cp.buildSafeUrl("/dc/content/CPR") + "?action=upload"
    @actList=[]
    @loadLocationList()
    @div = $("<div style='overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(@contents)
    form = new cp.HorizontalBootstrapForm(@div)
    @div=form.selectRow("Division")
    @rcnc=form.selectRow("RC/NC")
    @advisor=form.inputRow("Name of Advisor","",100)
    @venue=form.inputRow("Venue","",100)
    @datePhase1=form.inputRow("Date for Phase 1","",100)
    $(@datePhase1).datepicker({
      dateFormat: 'dd/mm/yy'
    })
    @faci=form.inputRow("Name of Facilitator","",100)
    @tour=form.inputRow("CLJ Tour","",100)
    @datePhase2=form.inputRow("Date for Phase 2","",100)
    $(@datePhase2).datepicker({
      dateFormat: 'dd/mm/yy'
    })
    @remark=form.inputRow("Remark","",100)
    table3=$("<table class='table'></table>").insertAfter(@remark)
    tr1=$("<tr></tr>").appendTo(table3);
    $("<td align='center'><h2>Citizen Type</h2></td>").appendTo(tr1);
    tr2=$("<tr></tr>").appendTo(table3)
    td1=$("<td></td>").appendTo(tr2)
    table1=$("<table></table>").appendTo(td1)
    $("<tr><th></th><th>Participated</th>").appendTo(table1)

    $("<tr><th>Locals</th><td><input id='local-part' class='form-control' type='text'></td>").appendTo(table1)
    $("<tr><th>New Immigrants</th><td><input id='immi-part' class='form-control' type='text'></td>").appendTo(table1)
    $("<tr><th>Foreigners</th><td><input id='fg-part' class='form-control' type='text'></td>").appendTo(table1)

    tr3=$("<tr></tr>").appendTo(table3);
    $("<td align='center'><h2>Country Of Birth</h2></td>").appendTo(tr3);
    tr4=$("<tr></tr>").appendTo(table3)
    td2=$("<td></td>").appendTo(tr4)
    table2=$("<table></table>").appendTo(td2)
    $("<tr><th></th><th></th><th></th>").appendTo(table2)
    $("<tr><th>Singapore</th><td><input id='n_local_part' class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>India</th><td><input id='n_india_part' class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>Indonesia</th><td><input id='n_indo_part' class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>Malaysia</th><td><input id='n_malay_part' class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>People Republic Of China</th><td><input id='n_cn_part' class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>Philipphine</th><td><input id='n_ph_part' class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>Others</th><td><input id='n_other_part' class='form-control' type='text'></td><td>Please State e.g (2 British, 1 Korean):</td><td><input id='n_other_remark' class='form-control' type='text'></td>").appendTo(table2)


    tr5=$("<tr></tr>").appendTo(table3);
    $("<td align='center'><h2>Ethnic</h2></td>").appendTo(tr5);
    tr6=$("<tr></tr>").appendTo(table3)
    td2=$("<td></td>").appendTo(tr6)
    table2=$("<table></table>").appendTo(td2)
    $("<tr><th></th><th></th><th></th>").appendTo(table2)
    $("<tr><th>Chinese</th><td><input id='e-cn-part' class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>Malay</th><td><input id='e-ma-part' class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>Indian</th><td><input id='e-in-part' class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>Others</th><td><input id='e-other-part' class='form-control' type='text'></td><td></td>").appendTo(table2)

    button=form.buttonRow("Submit")
    @formUpload =  $("<form id='upload-dialog-form' action='#{url}' enctype='multipart/form-data' method='post' name='upload' target='upload-iframe' />").insertAfter(table3)
    $("<input id='upload-dialog-name' type='file' name='file'/>").appendTo(@formUpload)
    $("<iframe id='upload-iframe' name='upload-iframe' src='' style='width:0;height:0;border:0px solid #fff;'></iframe>").insertAfter(table3)

    button.click (e) =>
      e.preventDefault()
      @formUpload.submit()
      @saveActivityDetail()

    $(@div).on "change", =>
      @rcnc.empty()
      divSel=$(@div).find(":selected").text()
      @buildRCNC(divSel)

  buildDivision:()=>
    data = @actList
    fullArray = []
    for v in data
      console.info(v[1])
      fullArray.push(v[1])

    uniqArray=_.uniq(fullArray)
    for i in uniqArray
      $("<option value='#{i}'>#{i}</option>").appendTo($(@div))

    currentDiv=@div.find(":selected").text()
    @buildRCNC(currentDiv)

  buildRCNC:(div)=>
    data = @actList
    for v in data
      if(v[1]==div)
        $("<option value='#{v[0]}'>#{v[0]}</option>").appendTo($(@rcnc))

  loadLocationList:()=>
    @onSelect(@result)

  saveActivityDetail:()=>
    @onSave(@pass)

  pass: ()=>
    console.info("success");

  result: (data)=>
    @actList = data
    console.info(data)
    @buildDivision()

  onSelect: (andThen)->
    req =
      jsonClass: "FieldRequest"
      universe: "capris"
      table: "rcnc_table"
      column: "rc_name"
      criteria:
        jsonClass: "ComparisonCriteria"
        operation: "starts-with"
        value: ""
      pk:
        table: "rcnc_table",
        column: "div_name"
      security:
        table: "rcnc_table",
        column: "cgd_id"
      page:
        offset: 0
        length: 20
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
    item = {basic:[],number:[]}
    division=$(@div).find(":selected").text()
    rcnc=$(@rcnc).find(":selected").text()
    adviser=$(@advisor).val()
    venue=$(@venue).val()
    faci=$(@faci).val()
    tour=$(@tour).val()
    phase1=$(@datePhase1).val()
    convertPhase1Date=$.datepicker.formatDate('yy-mm-dd', new Date(phase1))
    phase2=$(@datePhase2).val()
    convertPhase2Date=$.datepicker.formatDate('yy-mm-dd', new Date(phase2))
    remark=$(@remark).val()
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

    basicItem = new cp.BasicInfo("","AB","RC",adviser,venue,faci,tour,convertPhase1Date,convertPhase2Date,remark)
    numberItem = new cp.NumberInfo(sg_part,immi_part,foreigner_part,n_cn_part,n_ma_part,n_india_part,n_local_part,n_indo_part,n_philip_part,n_other_part,n_other_remark,e_cn_part,e_ma_part,e_in_part,e_other_part,uploadURL)
    console.info(basicItem)
    console.info(numberItem)
    item.basic.push(basicItem)
    item.number.push(numberItem)
    console.info(item)
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
