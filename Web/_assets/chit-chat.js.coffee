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
    @actList=[]
    @loadLocationList()
    @div = $("<div style='max-height: 800px; overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(@contents)
    form = new cp.HorizontalBootstrapForm(@div)
    @div=form.selectRow("Division")
    @rcnc=form.selectRow("RC/NC")
    @advisor=form.inputRow("Name of Advisor","",100)
    @venue=form.inputRow("Venue","",100)
    @date=form.inputRow("Date","",100)
    @faci=form.inputRow("Name of Facilitator","",100)
    @tour=form.inputRow("CLJ Tour","",100)
    @datePhase1=form.inputRow("Date for Phase 1","",100)
    @datePhase2=form.inputRow("Date for Phase 2","",100)
    remDiv=$("<div class='form-group'></div>").appendTo($(".form-horizontal"))
    $("<label class='col-sm-2 control-label'>Reimbursed (Y/N)</label>").appendTo(remDiv)
    $("<div class='col-sm-4'><input class='form-control' type='text'></div>").appendTo(remDiv)
    $("<label class='col-sm-2 control-label'>Remarks</label>").appendTo(remDiv)
    $("<div class='col-sm-4'><input class='form-control' type='text'></div>").appendTo(remDiv)
    table3=$("<table class='table'></table>").insertAfter(remDiv)
    tr1=$("<tr></tr>").appendTo(table3);
    td3 = $("<td align='center'><h2>Citizen Type</h2></td>").appendTo(tr1);
    td4 = $("<td align='center'><h2>Nationality</h2></td>").appendTo(tr1);
    tr2=$("<tr></tr>").appendTo(table3)
    td1=$("<td></td>").appendTo(tr2)
    td2=$("<td></td>").appendTo(tr2)
    table1=$("<table></table>").appendTo(td1)
    $("<tr><th></th><th>Invited</th><th>Participated</th>").appendTo(table1)
    $("<tr><th>Local Singaporean</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1)
    $("<tr><th>Naturalised Citizen</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1)
    $("<tr><th>New Citizen</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1)
    $("<tr><th>PRs</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1)
    $("<tr><th>Foreigners</th><td><input class='form-control' type='text'></td><td><input class='form-control' type='text'></td>").appendTo(table1)

    table2=$("<table></table>").appendTo(td2)
    $("<tr><th></th><th></th><th></th>").appendTo(table2)
    $("<tr><th>Malaysian</th><td><input class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>Indian</th><td><input class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>China PRC</th><td><input class='form-control' type='text'></td><td></td>").appendTo(table2)
    $("<tr><th>Others</th><td><input class='form-control' type='text'></td><td>Please State e.g (2 British, 1 Korean):</td><td><input class='form-control' type='text'></td>").appendTo(table2)
    $("<tr><th>Foreigners</th><td><input class='form-control' type='text'></td><td></td>").appendTo(table2)

    button=form.buttonRow("Submit")
    button.click (e) =>
      e.preventDefault()
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
    #@buildActivitySelection(@currentYear)

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
    title=$(@activity).find(":selected").text()
    date=$(@date).val()
    convertDate=$.datepicker.formatDate('yy-mm-dd', new Date(date))
    desc=$(@desc).val()
    org=$(@organiser).val()
    ic=$(@ic).val()
    part=parseInt($(@participants).val())
    immi=parseInt($(@immigrants).val())
    budget=parseFloat($(@budget).val())
    onepa=$(@onepa).val()
    activityItem = {"title":title,"date":convertDate,"description":desc,"organiser":org,"staff":ic,"participants":part,"immigrants":immi,"budget":budget,"onepa":onepa}
    console.info(activityItem)
    postURL = cp.buildSafeUrl("/adhoc/integration/update/activity")
    $.ajax({
      type: 'post'
      url: postURL
      contentType: 'application/json'
      data: JSON.stringify(activityItem)
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)


    })

cp.ChitChatSection=ChitChatSection
