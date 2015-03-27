cp.buildSafeUrl = (path,query)->
  sb = "/cpr"
  parts = path.split("/")
  for part in parts
    if (part.length>0)
      sb += ("/" + encodeURIComponent(part))
  sb + (query || "")

class Announcements
  constructor: () ->
   	cred=cp.credentials
    @contents = $("#sp-announcements-contents")
    @announcements = []
    @fillAnnouncements()

  fillAnnouncements: ()=>
    @contents.empty()
    headerForm = new cp.HorizontalBootstrapForm(@contents,cp.HorizontalBootstrapForm.OneElevenOptions())
    add = headerForm.buttonRow("Add Announcement")
    add.removeClass("btn-primary")
    add.click(@onAdd)
    @div = $("<div style='max-height: 800px; overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(@contents)
    footerForm = new cp.HorizontalBootstrapForm(@contents)
    save = footerForm.buttonRow("Save Changes")
    @infoSpan = $("<span style='margin-left: 10px;'></span>").insertAfter(save)
    $(save).click (event) ->
      event.preventDefault()
      @test
    data=[{"title":"BizInsights Maintenance 22/8","line1":"Update will start from 6:45pm to"},{"title":"Credit Card Maintenance","line1":"Credit Card facilities "},{"title":"BizInsights Maintenance 29/7","line1":"Update will start from 6:30pm to"},{"title":"BizInsights is now Live!","line1":"Please log in with your new"}]
    @buildAnnouncements(data)

  test: ()=>
    console.info("click")
    @onSave(@result)

  onSave: (andThen)->
    #refundStore = {"eventKey":"","items":[{"nric":"S8855563E","name":"Sherry","citizentype":"PR", "title":"1","date":"2","startTime":"3","endTime":"4","desc":"5","cgdId":"6","name":"Sherry","dateOfBirth":"10","citizentype":"11","hv_status":"12","Remarks":"13"}]}
    refundStore = {"title":"1","date":"2","startTime":"2014-01-01 01:01:00","endTime":"2014-01-01 01:01:00","desc":"5","cgdId":"6","rcCode":"10","nric":["S0000054C","S0000057F"]}
    console.info("click click")
    postURL = cp.buildSafeUrl("/adhoc/web/housevisit/update")
    $.ajax({
      type: 'post'
      url: postURL
      contentType: 'application/json'
      data: JSON.stringify(refundStore)
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)


    })

  result: ()=>
    console.info("done")


  buildAnnouncements: (as)->
    @announcements = []
    for a in as
      model = @buildModel(a)
      @announcements.push(model)
    #@updateEnabled()


  buildModel: (a)->
    model = {data: a}
    box = $("<div></div>").appendTo(@div)
    box.css("margin-bottom","30px").css("border-bottom","1px solid #CCC")
    form = new cp.HorizontalBootstrapForm(box)
    fields = {}
    [fields.title,model.delete] = form.inputRowWithButton("Title",a.title || "",32,"Delete")
    fields.line1 = form.inputRow("Line 1",a.line1 || "",100)
    model.up = $("<button class='btn'><span title='Move Up' class='glyphicon glyphicon-arrow-up'></span></btn>").insertBefore(model.delete)
    model.down = $("<button class='btn'><span title='Move Down' class='glyphicon glyphicon-arrow-down'></span></btn>").insertBefore(model.up)
    model.box = box
    model.fields = fields
    model.up.click(model,@onUp)
    model.down.click(model,@onDown)
    model.delete.click(model,@onDelete)
    model




cp.Announcements=Announcements
