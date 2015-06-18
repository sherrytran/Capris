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

class UserEdit
  constructor: () ->
    @signInUsers=[]
    @dashboardViewUsers=[]
    @adhocReportViewUsers=[]
    @adhocReportEditUsers=[]
   	cred=cp.credentials
    @contents = $("#management-contents")
    @fillManagement()
    @onCreateGroup(@buildGroups)
    @onGetCddCsDiv(@buildCdd)
    @onLoadUser(@resultUserInfo)

  fillManagement: ()=>
    @form=$("#edit-user-form")
    #@div = $("<div style='overflow-x: hidden; overflow-y: auto; margin-top: 10px; margin-bottom: 10px;'></div>").appendTo(@contents)
    @table1=$("#first-table")
    @table2=$("#second-table")
    tr1=$("<tr></tr>").appendTo(@table2);
    $("<td colspan='2'  align='left'><h4>User Profile</h4></td>").appendTo(tr1);
    $("<tr><th>User ID *</th><td><input id='userID' name='userID' class='form-control input-sm' type='text' readonly></td><td></td>").appendTo(@table2)
    $("<tr><th>User Name *</th><td><input id='userName' name='userName' class='form-control input-sm' type='text'></td><td></td>").appendTo(@table2)
    $("<tr><th>Password </th><td><input id='password' name='password' class='form-control input-sm' type='password'></td><td>(please leave it blank if you don't want to change the password)</td>").appendTo(@table2)
    $("<tr><th>Confirm Password </th><td><input id='cpassword' name='cpassword' class='form-control input-sm' type='password'></td><td></td>").appendTo(@table2)
    $("<tr><th>Email </th><td><input id='email' name='email' class='form-control input-sm' type='text'></td><td></td>").appendTo(@table2)
    $("<tr><th>Remark </th><td><input id='remark' name='remark' class='form-control input-sm' type='text'></td><td></td>").appendTo(@table2)

    tr2=$("<tr></tr>").appendTo(@table2);
    $("<td colspan='2'  align='left'><h4>Boundary</h4></td><td></td>").appendTo(tr2);
    $("<tr><th>Community Development Division (CDD)</th><td><select id='cdd' class='form-control input-sm'><option value='*'>All</option></select></td><td></td>").appendTo(@table2)
    $("<tr><th>Constituency (GRC/SMC)</th><td><select id='grc' class='form-control input-sm'></select></td><td></td>").appendTo(@table2)
    $("<tr><th>Division</th><td><select id='division' class='form-control input-sm'></select></td><td></td>").appendTo(@table2)

    tr3=$("<tr></tr>").appendTo(@table2);
    $("<td colspan='2'  align='left'><h4>Role</h4></td>").appendTo(tr3);
    $("<tr><th>Access Group</th><td><select id='access-group' class='form-control input-sm'></select></td><td><a href='/cpr/group-config.html'>Group Configuration</a></td>").appendTo(@table2)


    tr4=$("<tr></tr>").appendTo(@table2);
    $("<td colspan='2'  align='left'><h4>Account Setting</h4></td><td></td>").appendTo(tr4);
    $("<tr><th>Disable</th><td><input id='disable' type='checkbox'></td><td></td>").appendTo(@table2)

    @button=$("<button class='btn btn-primary'>Save Changes</button>").appendTo(@table2)
    $(@table1).on "click", "tr td:first-child", (e) =>
      selectedName=$(e.target).text()
      $.each(@UserArray,(i,val)=>
        userName=val.name
        if(userName is selectedName)
          if(val.extraFields)
            id=val.extraFields.userID
            remark=val.extraFields.Remark
          else
            id=""
            remark=""
          email=val.email
          groups=val.groups
          enable=val.enabled
          $("#userID").val(selectedName)
          $("#userName").val(id)
          $("#email").val(email)
          $("#remark").val(remark)
          @assignGroup(groups)
          if enable
            $("#disable").prop('checked',false)
          else
            $("#disable").prop('checked',true)
          return false
      )

    @button.click (e) =>
      e.preventDefault()
      if($(@form).valid())
        @successSave()

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
        },
        userName: {
          required: true
        },
        password:{
          passwordpolicy:
            depends: (element) ->
              $('#password').val().length>0
          minlength: ->
            if($('#password').val().length>0)
              8
        }
        cpassword:{
          required:
            depends: (element) ->
              $('#password').val().length>0
          equalTo:"#password"
        },
        email:{
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

        cpassword:{
          required:"Please Enter A Confirmation Password",
          equalTo:"Your Confirmation Password Did Not Match Your Above Password",
        },
        email:{
          email:"Please Enter A Valid Email"
        }
      }
    })

  assignGroup:(c)=>
    $.each(c,(i,value)=>
      if value.indexOf("cgd")!=-1
        parts=value.split("-")
        $('#cdd').val(parts[1])
        $('#cdd').change()
        if parts[1] is "*"
          $('#grc').val("*")
          $('#division').val("*")
        else
          $('#grc').val(parts[2])
          $('#grc').change()
          if parts[2] is "*"
            $('#division').val("*")
          else
            $('#division').val(parts[3])
      else
        $('#access-group').val(value)
    )

  buildGroups:(data)=>
    $.each(data,(i,val)=>
      groupName=val.name
      if groupName.indexOf("cgd")==-1
        $("<option value='#{groupName}'>#{groupName}</option>").appendTo($('#access-group'))
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
    if cdd is "*"
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
    @onLoadUser(@resultUserInfo)
    alert("Changed User Profile Successfully")

  successSave: ()=>
    userid=$("#userID").val()
    @onSave(userid,@result)


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


  onSave: (userid,andThen)->
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
    if password.length>0
      items=new cp.UserAccount(username,false,disabled,true,groups,email,extra,password)
    else
      items=new cp.UserAccountNoPass(username,false,disabled,true,groups,email,extra)
    postURL = cp.buildSafeUrl("/ad/usergroupdb/user/#{userid}")
    $.ajax({
      type: 'put'
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

  resultUserInfo:(data)=>
    @UserArray = data
    @table1.empty()
    tr=$("<tr></tr>").appendTo(@table1);
    $("<td colspan='2'  align='left'><h4>User Account</h4></td>").appendTo(tr);
    $("<tr><td>User ID</td><td>User Name</td></tr>").appendTo($(@table1))
    $.each(data,(i,val)=>
      userName=val.name
      extra = val.extraFields
      if(extra)
        userID=extra.userID
        if(!userID)
          userID=""
      else
        userID=""
      isAdmin = val.admin
      if !isAdmin
        $("<tr><td style='cursor: pointer'>#{userName}</td><td>#{userID}</td></tr>").appendTo($(@table1))
    )

class UserAccount
  constructor: (@name,@admin,@enabled,@changePassword,@groups,@email,@extraFields,@password)->

class UserAccountNoPass
  constructor: (@name,@admin,@enabled,@changePassword,@groups,@email,@extraFields)->

cp.UserAccount = UserAccount
cp.UserEdit=UserEdit
cp.UserAccountNoPass = UserAccountNoPass
