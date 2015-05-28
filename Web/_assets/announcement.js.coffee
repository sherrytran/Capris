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
    @table = $("#first-table")
    tr=$("<tr></tr>").appendTo(@table);
    $("<td colspan='2'  align='left'><h4>Announcement</h4></td>").appendTo(tr);
    $("<tr><th>Title: </th><td><input maxlength='30' id='title' name='title' class='form-control input-sm' type='text'></td>").appendTo(@table)
    $("<tr><th>Description</th><td><textarea maxlength='150' id='description' name='description' class='form-control input-sm' type='text'></textarea></td>").appendTo(@table)
    $("<tr><th>Start Date</th><td><input id='startdate' name='startdate' class='form-control input-sm' type='text'></td>").appendTo(@table)
    $("<tr><th>End Date</th><td><input id='enddate' name='enddate' class='form-control input-sm' type='text'></td>").appendTo(@table)
    $("<tr><th>Repeat</th><td><input id='repeat' type='checkbox'></td>").appendTo(@table)
    $("<tr><th>Repeat Frequency</th><td><select id='frequency' class='form-control input-sm'></td>").appendTo(@table)
    $("<option value='Daily'>Daily</option><option value='Monthly'>Monthly</option><option value='Yearly'>Yearly</option>").appendTo($("#frequency"))
    @submit=$("<button>Submit</button>").appendTo(@table)
    @submit.click (e) =>
      e.preventDefault()
      @test()

  test: ()=>
    console.info("click")
    @onSave(@result)

  onSave: (andThen)->
    title=$("#title").val()
    desc=$("#description").val()
    start=$("#startdate").val()
    end=$("#enddate").val()
    #recur=$("#repeat").is(':checked')
    repeat_frequency = $("#frequency").val()
    item= new AnnouncementItem(title,desc,start,end,'1',repeat_frequency)
    console.info(item)
    postURL = cp.buildSafeUrl("/adhoc/web/update/announcement")
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

  result: ()=>
    console.info("done")

class AnnouncementItem
  constructor: (@title,@description,@start_date,@end_date,@recur,@repeat_frequency) ->

cp.Announcements=Announcements
