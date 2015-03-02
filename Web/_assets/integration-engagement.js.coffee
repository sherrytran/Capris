cp.buildSafeUrl = (path,query)->
  sb = "/cpr"
  parts = path.split("/")
  for part in parts
    if (part.length>0)
      sb += ("/" + encodeURIComponent(part))
  sb + (query || "")

class IntegrationEngagement
  constructor: () ->
   	cred=cp.credentials
    @contents = $("#integration-engagement-contents")
    @fillActivity()


  fillActivity: () =>
    @actList=[]
    @loadActivityList()
    currentDate = new Date()
    @currentYear = currentDate.getFullYear()
    preYear = @currentYear-1
    @div = $("<div style='max-height: 800px; overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(@contents)
    form = new cp.HorizontalBootstrapForm(@div)
    year=form.selectRow("Year")
    @activity=form.selectRow("Activity Title")
    $("<option value='#{@currentYear}'>#{@currentYear}</option>").appendTo($(year))
    $("<option value='#{preYear}'>#{preYear}</option>").appendTo($(year))
    @date=form.inputRow("Date","",100)
    $(@date).datepicker(dateFormat: 'dd-mm-yy')
    @desc=form.inputRow("Activity Description","",100)
    @organiser=form.inputRow("Main Organiser","",100)
    @ic=form.inputRow("Staff IC","",100)
    @participants=form.inputRow("Number of Participants (A)","",100)
    @immigrants=form.inputRow("Number of New Immigrants Engaged (B)","",100)
    @budget=form.inputRow("Budget Spent","",100)
    @onepa=form.inputRow("OnePA Activity Code","",100)
    button=form.buttonRow("Submit")
    @infoSpan = $("<p style='display:inline;margin-left:8px; color:red'></p>").insertAfter(button)
    button.click (e) =>
      e.preventDefault()
      @saveActivityDetail()

    $(year).on "change", =>
      @activity.empty()
      yearSel=$(year).find(":selected").text()
      @buildActivitySelection(yearSel)

  buildActivitySelection:(yearsel)=>
    data = @actList
    for v in data
      if(parseInt(v["year"])==parseInt(yearsel))
        $("<option value='#{v["title"]}'>#{v["title"]}</option>").appendTo($(@activity))

  loadActivityList:()=>
    @onSelect(@result)

  saveActivityDetail:()=>
    @onSave(@pass)

  pass: ()=>
    @infoSpan.text("Save Successfully")
    window.setTimeout(( =>@infoSpan.text("")),4000)
    console.info("success");

  result: (data)=>
    @actList = data
    @buildActivitySelection(@currentYear)

  onSelect: (andThen)->
    postURL = cp.buildSafeUrl("/adhoc/integration/get/activity")
    $.ajax({
      type: 'get'
      url: postURL
      dataType: 'json'
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)
    })

  onSave: (andThen)->
    @infoSpan.text("Saving...")
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



cp.IntegrationEngagement=IntegrationEngagement
