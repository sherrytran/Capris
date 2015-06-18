cp.buildSafeUrl = (path,query)->
  sb = "/cpr"
  parts = path.split("/")
  for part in parts
    if (part.length>0)
      sb += ("/" + encodeURIComponent(part))
  sb + (query || "")

class UserDelete
  constructor: () ->
    @checkedValue=[]
   	cred=cp.credentials
    @contents = $("#delete-contents")
    @emailArray=[]
    @fillManagement()
    @onLoadUser(@result)

  fillManagement: ()=>
    url = cp.buildSafeUrl("/dc/content/CPR/MyTest") + "?action=upload"
    @form=$("#delete-user-form")
    @table=$("#first-table")
    @tableUpload=$("<table>").insertBefore(@table)
    tr=$("<tr></tr>").appendTo(@tableUpload);
    td=$("<td></td>").appendTo(tr)
    tdBut=$("<td></td>").appendTo(tr)
    @formUpload =  $("<form id='upload-dialog-form' action='#{url}' enctype='multipart/form-data' method='post' name='upload' target='upload-iframe' />").appendTo(td)
    @uploadBut = $("<button class='btn btn-primary'>Upload</button>").appendTo(tdBut)
    $("<input id='upload-dialog-name' name='uploadFile' type='file' name='file'/>").appendTo(@formUpload)
    $("<iframe id='upload-iframe' name='upload-iframe' src='' style='width:0;height:0;border:0px solid #fff;'></iframe>").insertAfter(@table)
    @button=$("<button class='btn btn-primary'>Delete</button>").appendTo(@form)
    @uploadBut.click (e) =>
      e.preventDefault()
      @onDeleteFolder(@deleteOldFolder)

    @button.click (e) =>
      e.preventDefault()
      @delete()


  result:(data)=>
    tr=$("<tr></tr>").appendTo(@table);
    $("<td colspan='2'  align='left'><h4>User Account</h4></td>").appendTo(tr);

    $.each(data,(i,val)=>
      userName=val.name
      $("<tr><td>#{userName}</td><td><input id='#{userName}' value='#{userName}' type='checkbox'></td>").appendTo($(@table))
    )

  createUserListAfterUpload:(data)=>
    $.each(data,(i,val1)=>
      $("##{val1.name}").attr('checked', false)
      $.each(@emailArray,(i,val2)=>
        if(val1.email==val2)
          $("##{val1.name}").attr('checked', true)
      )
    )

  deleteResult:()=>
    @initUser()


  doInitUser:()=>
    alert("Delete Successfully")
    @table.empty()
    @onLoadUser(@result)

  delete: ()=>
    @checkedValues = $('input:checkbox:checked').map(->
      @value
    ).get()
    if(@checkedValues.length>0)
      @initUser = _.after(@checkedValues.length,@doInitUser)
      $.each(@checkedValues,(i,val)=>
        @onDelete(val,@deleteResult)
      )
    else
      alert("You need to select at least 1 user to delete")


  onLoadUser: (andThen)->
    postURL = cp.buildSafeUrl("/ad/usergroupdb/user")
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


  onDelete: (userName,andThen)->
    postURL = cp.buildSafeUrl("/ad/usergroupdb/user/#{userName}")
    $.ajax({
      type: 'DELETE'
      url: postURL
      dataType: 'json'
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)
    })

  onDeleteFolder: (andThen)->
    postURL = cp.buildSafeUrl("/dc/content/CPR/MyTest")
    $.ajax({
      type: 'DELETE'
      url: postURL
      dataType: 'json'
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)
    })

  onCreateFolder: (andThen)->
    postURL = cp.buildSafeUrl("/dc/content/CPR/MyTest/")+"?action=create-folder"
    $.ajax({
      type: 'post'
      url: postURL
      dataType: 'json'
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)
    })

  onLoadUserEmail: (andThen)->
    postURL = cp.buildSafeUrl("/ds/CPR/MyTest/cmp_HR.ds")+"?mime-type=application/json"
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

  getUserEmail:(data)=>
    @emailArray=[]
    $.each(data.data,(i,val)=>
      @emailArray.push(val.Email)
    )
    @onLoadUser(@createUserListAfterUpload)

  deleteOldFolder:()=>
    @onCreateFolder(@createNewFolder)

  createNewFolder:()=>
    @formUpload.submit()
    $("#upload-iframe").unbind 'load'
    $("#upload-iframe").load (e) =>
      alert('Upload completed')
      @onLoadUserEmail(@getUserEmail)



class UserAccount
  constructor: (@admin,@changePassword,@email,@enabled,@extraFields,@groups,@name,@password) ->

cp.UserAccount = UserAccount
cp.UserDelete=UserDelete
