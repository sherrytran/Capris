cp.buildSafeUrl = (path,query)->
  sb = "/cpr"
  parts = path.split("/")
  for part in parts
    if (part.length>0)
      sb += ("/" + encodeURIComponent(part))
  sb + (query || "")

jQuery.validator.addMethod 'requirePAEmail', ((value, element) ->
      re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/
      if re.test(value)
        if value.indexOf('@pa.gov.sg', value.length - ('@pa.gov.sg'.length)) != -1
          true
        else
          false
      else
        false
    ), 'Your email address must have @pa.gov.sg'

$.validator.addMethod 'passwordpolicy', ((value, element) ->
  @optional(element) or value.match(/[a-z]/) and value.match(/[0-9]/) and value.match(/[A-Z]/)
), 'Password must contain at least one numeric and one upper case and one lower case character.'

$.validator.addMethod 'alphanumeric', ((value, element) ->
  @optional(element) or /^\w+$/i.test(value)
), 'Letters, numbers, and underscores only .'


class UserManagement
  constructor: () ->
    @signInUsers=[]
    @dashboardViewUsers=[]
    @adhocReportViewUsers=[]
    @adhocReportEditUsers=[]
   	cred=cp.credentials
    @contents = $("#management-contents")
    @fillManagement()
    @onLoadUser(@userList)
    @onLoadSignInGroup(@successSignInLoad)
    @onCreateGroup(@buildGroups)
    @onGetCddCsDiv(@buildCdd)
    @userNameArray=[]

  fillManagement: ()=>
    @form=$("#create-user-form")
    #@div = $("<div style='overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(@contents)
    table=$("#first-table")
    tr1=$("<tr></tr>").appendTo(table);
    $("<td colspan='2'  align='left'><h4>User Profile</h4></td>").appendTo(tr1);
    $("<tr><th>User ID *</th><td><input id='userID' name='userID' class='form-control input-sm' type='text'></td>").appendTo(table)
    $("<tr><th>User Name *</th><td><input id='userName' name='userName' class='form-control input-sm' type='text'></td>").appendTo(table)
    $("<tr><th>Password *</th><td><input id='password' name='password' class='password form-control input-sm' type='password'></td>").appendTo(table)
    $("<tr><th>Confirm Password *</th><td><input id='cpassword' name='cpassword' class='form-control input-sm' type='password'></td>").appendTo(table)
    $("<tr><th>Email </th><td><input id='email' name='email' class='form-control input-sm' type='text'></td>").appendTo(table)
    $("<tr><th>Remark </th><td><input id='remark' name='remark' class='form-control input-sm' type='text'></td>").appendTo(table)

    tr2=$("<tr></tr>").appendTo(table);
    $("<td colspan='2'  align='left'><h4>Boundary</h4></td>").appendTo(tr2);
    $("<tr><th>Community Development Division (CDD)</th><td><select id='cdd' class='form-control input-sm'><option value='*'>All</option></select></td>").appendTo(table)
    $("<tr><th>Constituency (GRC/SMC)</th><td><select id='grc' class='form-control input-sm'></select></td>").appendTo(table)
    $("<tr><th>Division</th><td><select id='division' class='form-control input-sm'></select></td>").appendTo(table)

    tr3=$("<tr></tr>").appendTo(table);
    $("<td colspan='2'  align='left'><h4>Role</h4></td>").appendTo(tr3);
    $("<tr><th>Access Group</th><td><select id='access-group' class='form-control input-sm'></select></td>").appendTo(table)


    tr4=$("<tr></tr>").appendTo(table);
    $("<td colspan='2'  align='left'><h4>Account Setting</h4></td>").appendTo(tr4);
    $("<tr><th>Disable</th><td><input id='disable' type='checkbox'></td>").appendTo(table)

    @button=$("<button class='btn btn-primary'>Submit</button>").appendTo(table)
    @button.click (e) =>
      e.preventDefault()
      if($(@form).valid())
        @successCreate()

    $("#cdd").on "change", =>
      $("#grc").empty()
      @currentCdd=$("#cdd").val()
      @buildCs(@currentCdd,@CddCsDivData)

    $("#grc").on "change", =>
      $("#division").empty()
      @currentCs=$("#grc").val()
      @buildDiv(@currentCs,@CddCsDivData)

  validate:()=>
    $(@form).validate({
      rules: {
        userID: {
          required: true
          alphanumeric:true
          minlength:3
        },
        userName: {
          required: true
        },
        password:{
          required: true
          passwordpolicy: true
          minlength:8
        },
        cpassword:{
          required:true
          equalTo:"#password"
        },
        email:{
          required:true
          email:true
          requirePAEmail:true
        }
      },
      messages: {
        userID: {
          required: "Please Enter An User ID"
        },
        userName: {
          required: "Please Enter An User Name"
        },
        password:{
          required: "Please Enter A Password"
          minlength: "Please Enter Minimum 8 Characters"
        },
        cpassword:{
          required:"Please Enter A Confirmation Password",
          equalTo:"Your Confirmation Password Did Not Match Your Above Password",
        },
        email:{
          required:"Please Enter An Email"
          email:"Please Enter A Valid Email"
        }
      }
    })

  buildGroups:(data)=>
    $.each(data,(i,val)=>
      groupName=val.name
      if groupName.indexOf("cgd")==-1
        $("<option>#{groupName}</option>").appendTo($('#access-group'))
    )

  buildCdd:(data)=>
    @CddCsDivData = data
    cddArray=[]
    $.each($.unique(data),(i,val)=>
      cddName=val.cdd_name
      cddCode=val.cdd_code
      if (cddArray.indexOf(cddCode) == -1)
        cddArray.push(cddCode)
        $("<option value='#{cddCode}'>#{cddName}</option>").appendTo($('#cdd'))
    )
    @buildCs("*",data)

  buildCs:(cdd,data)=>
    csArray=[]
    if cdd is "*"
      $("<option value='*'>All</option>").appendTo($('#grc'))
    else
      $("<option value='*'>All</option>").appendTo($('#grc'))
      $.each(data,(i,val)=>
        if(val.cdd_code is cdd)
          csName=val.capris_cs_name
          csCode=val.capris_cs_code
          if(csArray.indexOf(csCode)==-1)
            csArray.push(csCode)
            $("<option value='#{csCode}'>#{csName}</option>").appendTo($('#grc'))
      )
    @currentGRC=$("#grc").val()
    @buildDiv(@currentGRC,data)

  buildDiv:(cs,data)=>
    $("#division").empty()
    if cs is "*"
      $("<option value='*'>All</option>").appendTo($('#division'))
    else
      $("<option value='*'>All</option>").appendTo($('#division'))
      $.each(data,(i,val)=>
        if(val.capris_cs_code is cs)
          divName=val.div_name
          divCode=val.div_code
          $("<option value='#{divCode}'>#{divName}</option>").appendTo($('#division'))
      )

  result:()=>
    username=$('#userID').val()
    @onSaveUserFunction("SignIn",@signInUsers,@signInResult)
    @onSaveUserFunction("AdhocDashboardView",@dashboardViewUsers,@signInResult)
    @onSaveUserFunction("AdhocReportView",@adhocReportViewUsers,@signInResult)
    @onSaveUserFunction("AdhocReportEdit",@adhocReportEditUsers,@signInResult)
    @userNameArray.push(username)
    alert("Create User Successfully")

  signInResult:()=>
    console.info("enable sign in")

  onSaveUserFunction:(functionName,array,andThen)->
    username=$('#userID').val()
    array.push(username)
    postURL = cp.buildSafeUrl("ad/usergroupdb/function/#{functionName}")
    $.ajax({
      type: 'post'
      url: postURL
      contentType: 'application/json'
      data: JSON.stringify(array)
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR)
        console.info(errorThrown)
    })

  successCreate: ()=>
    checked=0
    username=$('#userID').val()
    for i in @userNameArray
      if i==username
        alert("User Name has already existed")
        checked = 1
        break
    if checked!=1
      @onCreate(@result)

  successSignInLoad:(data)=>
    $.each(data,(i,val)=>
      name=val.name
      if name is "SignIn"
        @signInUsers=val.users
      if name is "AdhocDashboardView"
        @dashboardViewUsers=val.users
      if name is "AdhocReportView"
        @adhocReportViewUsers=val.users
      if name is "AdhocReportEdit"
        @adhocReportViewUsers=val.users
    )



  onLoadSignInGroup: (andThen)->
    postURL = cp.buildSafeUrl("/ad/usergroupdb/function")
    $.ajax({
      type: 'get'
      url: postURL
      dataType: 'json'
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        console.info(textStatus)
        console.info(jqXHR.responseText)
        console.info(errorThrown)
    })

  onCreateGroup: (andThen)->
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

  locationGroupValue:()=>
    preString="cgd-"
    cdd=$("#cdd").val()
    cs=$("#grc").val()
    div=$("#division").val()
    if cdd is "*"
      group=preString+cdd
    else
      if cs is "*"
        group=preString+cdd+"-"+cs
      else
        group=preString+cdd+"-"+cs+"-"+div
    group


  onCreate: (andThen)->
    groups=[]
    locationGroup=@locationGroupValue()
    accessGroup=$("#access-group").val()
    groups.push(locationGroup)
    groups.push(accessGroup)
    extra={Remark:null,userID:null}
    username=$('#userID').val()
    extra.userID=$('#userName').val()
    extra.Remark=$('#remark').val()
    password=$('#password').val()
    email=$('#email').val()
    disabled = $("#disable").is(':checked')
    if disabled is true
      disabled = false
    else
      disabled = true
    items=new cp.UserAccount(false,true,email,disabled,extra,groups,username,password)
    postURL = cp.buildSafeUrl("/ad/usergroupdb/user")
    $.ajax({
      type: 'post'
      url: postURL
      contentType: 'application/json'
      data: JSON.stringify(items)
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        alert(jqXHR.responseText)
    })

  onGetCddCsDiv: (andThen)->
    postURL = cp.buildSafeUrl("/adhoc/web/get/c-cdd-cs-div")
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

  onLoadUser: (andThen)=>
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

  userList:(data)=>
    $.each(data,(i,val)=>
      username=val.name
      @userNameArray.push(username)
    )

class UserAccount
  constructor: (@admin,@changePassword,@email,@enabled,@extraFields,@groups,@name,@password) ->

cp.UserAccount = UserAccount
cp.UserManagement=UserManagement
