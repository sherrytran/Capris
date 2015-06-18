cp.buildSafeUrl = (path,query)->
  sb = "/cpr"
  parts = path.split("/")
  for part in parts
    if (part.length>0)
      sb += ("/" + encodeURIComponent(part))
  sb + (query || "")

class GroupConfig
  constructor: () ->
   	cred=cp.credentials
    @accessArray=[]
    @contents = $("#management-contents")
    @fillGroup()
    @init()

  init:()=>
    @onLoadGroup(@buildGroups)
    @fileArray=["NewCitizen_PR_Resident","HouseVisit_Plan","HouseVisit_Update","HouseVisit_Report","IntegrationEngagement_Config","IntegrationEngagement_KPI_Budget_Allocation","IntegrationEngagement_Activity","IntegrationEngagement_Report","ChitChat_Session","ChitChat_Report","INC_Upload","INC_HQ","INC_Report","Letter_Generation","CSSGCC_Plan","CSSGCC_Update","CSSGCC_SET_Update","ROM_Landing_Page","ROM_Upload","ROM_Maintain_Solemnizer","ROM_Configure_Division","ROM_Report"]
    @loadAllFilesACL()
    @initCheckboxes = _.after(@fileArray.length, @doInitCheckboxes)


  fillGroup: ()=>
    @form=$("#create-user-form")
    #@div = $("<div style='overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(@contents)
    table=$("#first-table")

    tr=$("<tr></tr>").appendTo(table);
    $("<td colspan='2'  align='left'><h4>Add Group</h4></td>").appendTo(tr);
    $("<tr><th>Group Name</th><td><input id='add-group' type='text'></td><td><button class='btn btn-primary' id='create-but'>Create</button>").appendTo(table)

    table2=$("<table id='second-table' class='table table-responsive' style='width: 50%;'></table>").insertAfter(table)

    tr1=$("<tr></tr>").appendTo(table2);
    $("<td colspan='2'  align='left'><h4>User Profile</h4></td>").appendTo(tr1);
    $("<tr><th>Access Group</th><td><select id='access-group' class='form-control input-sm'></select></td>").appendTo(table2)

    tr4=$("<tr></tr>").appendTo(table2);
    $("<td colspan='2'  align='left'><h4>List Of Modules</h4></td>").appendTo(tr4);
    $("<tr><th>Information Report on New Residents, New PRs and NCs for all Divisions</th><td><input class='checkbox_checked' id='NewCitizen_PR_Resident' type='checkbox' value='NewCitizen_PR_Resident'></td>").appendTo(table2)
    $("<tr><th>HV Planning</th><td><input class='checkbox_checked' id='HouseVisit_Plan' input-sm' type='checkbox' value='Plan_House_Visit'></td>").appendTo(table2)
    $("<tr><th>HV Update</th><td><input class='checkbox_checked' id='HouseVisit_Update' type='checkbox' value='Update_House_Visit'></td>").appendTo(table2)
    $("<tr><th>HV Report</th><td><input class='checkbox_checked' id='HouseVisit_Report' input-sm' type='checkbox' value='House_Visit_Report'></td>").appendTo(table2)
    $("<tr><th>INT Configuration</th><td><input class='checkbox_checked' id='IntegrationEngagement_Config' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>KPI & Budget Allocation</th><td><input class='checkbox_checked' id='IntegrationEngagement_KPI_Budget_Allocation' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>Activities</th><td><input class='checkbox_checked' id='IntegrationEngagement_Activity' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>INT Report</th><td><input class='checkbox_checked' id='IntegrationEngagement_Report' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>Chit Chat Session </th><td><input class='checkbox_checked' id='ChitChat_Session' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>Chit Chat Report</th><td><input class='checkbox_checked' id='ChitChat_Report' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>Letter Generation Welcome Letter</th><td><input class='checkbox_checked' id='Letter_Generation' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>INC Upload Appointment/Re-appointment</th><td><input class='checkbox_checked' id='INC_Upload' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>INC View Upload Status</th><td><input class='checkbox_checked' id='INC_HQ' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>INC Reports</th><td><input class='checkbox_checked' id='INC_Report' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>ROM Landing Page</th><td><input class='checkbox_checked' id='ROM_Landing_Page' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>ROM Upload Files</th><td><input class='checkbox_checked' id='ROM_Upload' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>ROM Maintain Solemnizer</th><td><input class='checkbox_checked' id='ROM_Maintain_Solemnizer' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>ROM Configuration Division</th><td><input class='checkbox_checked' id='ROM_Configuration_Division' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>ROM Report</th><td><input class='checkbox_checked' id='ROM_Report' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>CSS/GCC Plan</th><td><input class='checkbox_checked' id='CSSGCC_Plan' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>CSS/GCC Update</th><td><input class='checkbox_checked' id='CSSGCC_Update' input-sm' type='checkbox'></td>").appendTo(table2)
    $("<tr><th>SET Update</th><td><input class='checkbox_checked' id='CSSGCC_SET_Update' input-sm' type='checkbox'></td>").appendTo(table2)

    $("#create-but").click (e) =>
      e.preventDefault()
      @onCreateGroup(@createGroup)


    $("#access-group").on 'change', (e) =>
      group=$(e.target).attr('value')
      $.each(@accessArray,(i,val)=>
        if(_.some(val.acl, (el)-> el.by == group))
          fileName=val.path.split("/").pop().split(".")[0]
          $("##{fileName}").prop("checked", true);
        else
          fileName=val.path.split("/").pop().split(".")[0]
          $("##{fileName}").prop("checked", false);
      )

    $(".checkbox_checked").on 'click', (e) =>
      dbName=$(e.target).attr('id')
      $.each(@accessArray,(i,val)=>
        path = val.path
        if(path.indexOf(dbName)>0)
          checkedGroup=$("#access-group").val()
          if ($(e.target).is(':checked'))
            val.acl.push({by:checkedGroup,write:false})
          else
            val.acl=_.reject(val.acl, (el)->el.by == checkedGroup)
          @AddGroupForDashboard(path,val,@successAdded)
          false
      )



  successAdded:()=>
    console.info("success added")

  doInitCheckboxes:()=>
    group=$("#access-group").val()
    $.each(@accessArray,(i,val)=>
      if(_.some(val.acl, (el)-> el.by == group))
        fileName=val.path.split("/").pop().split(".")[0]
        $("##{fileName}").prop("checked", true);
      else
        fileName=val.path.split("/").pop().split(".")[0]
        $("##{fileName}").prop("checked", false);
    )

  loadAllFilesACL:()=>
    for c in @fileArray
      @getDashboardInfo(c,@result)

  createGroup:()=>
    name=@newGroupName
    $("<option>#{name}</option>").appendTo($('#access-group'))
    $('#access-group').val(name)
    $('#access-group').change()

  buildGroups:(data)=>
    $.each(data,(i,val)=>
      groupName=val.name
      if groupName.indexOf("cgd")==-1
        $("<option>#{groupName}</option>").appendTo($('#access-group'))
    )

  result:(data)=>
    @accessArray.push(data)
    @aclArray=data.acl
    @filePath=data.path
    @initCheckboxes()

  successCreate: ()=>
    @onCreate(@result)

  onLoadGroup: (andThen)->
    postURL = cp.buildSafeUrl("/ad/usergroupdb/group")
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

  onCreateGroup: (andThen)->
    @newGroupName=$("#add-group").val()
    item={name:"",users:[]}
    if @newGroupName!=""
      item.name=@newGroupName
      postURL = cp.buildSafeUrl("/ad/usergroupdb/group")
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
    else
      alert("Please enter your group name.")

  getDashboardInfo:(dashboard,andThen)->
    postURL = cp.buildSafeUrl("/dc/content/CAPRIS/dashboard/#{dashboard}.dashboard")+"?query=effective-acl"
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

  AddGroupForDashboard:(path,item,andThen)->
    postURL = cp.buildSafeUrl("/dc/content#{path}")+"?action=acl"
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

cp.GroupConfig=GroupConfig
