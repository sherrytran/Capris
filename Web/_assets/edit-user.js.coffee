cp.buildSafeUrl = (path,query)->
  sb = "/cpr"
  parts = path.split("/")
  for part in parts
    if (part.length>0)
      sb += ("/" + encodeURIComponent(part))
  sb + (query || "")

jQuery.validator.addMethod 'requireGmailEmail', ((value, element) ->
      re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/
      if re.test(value)
        if value.indexOf('@pa.gov.sg', value.length - ('@pa.gov.sg'.length)) != -1
          true
        else
          false
      else
        false
    ), 'Your email address must have @pa.gov.sg'

jQuery.validator.addMethod 'notEqual', ((value, element, param) ->
  @optional(element) or value != $(param).val()
), 'Your New Password can not be same as your old password'

$.validator.addMethod 'passwordpolicy', ((value, element) ->
  @optional(element) or value.match(/[a-z]/) and value.match(/[0-9]/) and value.match(/[A-Z]/)
), 'Password must contain at least one numeric and one upper case and one lower case character.'

class UserEdit
  constructor: () ->
    @checkedValue=[]
   	@cred=cp.credentials
    @UserArray=[]
    @contents = $("#edit-contents")
    @fillManagement()

  fillManagement: ()=>
    @table1=$("#password-table")
    @table2=$("#email-table")
    @form1=$("#password-form")
    @form2=$("#email-form")
    tr1=$("<tr></tr>").appendTo(@table1)
    $("<td colspan='2'  align='left'><h4>Password Setting</h4></td>").appendTo(tr1)
    $("<tr><th>Old Password *</th><td><input id='oldPass' name='oldPass' class='form-control input-sm' type='password'></td>").appendTo(@table1)
    $("<tr><th>New Password *</th><td><input id='newPass' name='password' class='form-control input-sm' type='password'></td>").appendTo(@table1)
    $("<tr><th>Confirm Password *</th><td><input id='conPass' name='conPass' class='password form-control input-sm' type='password'><div class='password-meter'><div class='password-meter-message> </div><div class='password-meter-bg'><div class='password-meter-bar'></div></div></div></td>").appendTo(@table1)
    @button1=$("<button class='btn btn-primary'>Save</button>").appendTo(@table1)

    tr2=$("<tr></tr>").appendTo(@table2)
    $("<td colspan='2'  align='left'><h4>Email Setting</h4></td>").appendTo(tr2)
    $("<tr><th>Password *</th><td><input id='cpassword' name='cpassword' class='form-control input-sm' type='password'></td>").appendTo(@table2)
    $("<tr><th>Email </th><td><input id='newEmail' name='newEmail' class='form-control input-sm' type='text'></td>").appendTo(@table2)
    @button2=$("<button class='btn btn-primary'>Save</button>").appendTo(@table2)
    $("#newEmail").val(elx.parameters.email)
    @button1.click (e) =>
      e.preventDefault()
      name=@cred.username
      #@onLoadUser(@result)
      if($(@form1).valid())
        oldPassword=$("#oldPass").val()
        newPassword=$("#newPass").val()
        item= new UserPassword(name,newPassword,oldPassword)
        @onSave(item,"user-password",@savePassSuccess)

    @button2.click (e) =>
      e.preventDefault()
      name=@cred.username
      if($(@form2).valid())
        pass=$("#cpassword").val()
        newEmail=$("#newEmail").val()
        item2= new UserEmail(name,newEmail,pass)
        @onSave(item2,"user-email",@saveEmailSuccess)



  validateEmailForm:()=>
    $(@form2).validate({
      rules: {
        cpassword: {
          required: true
        },
        newEmail:{
          required: true
          requireGmailEmail:true
        }
      },
      messages: {
        cpassword: {
          required: "Need To Provide Your Current Password"
        },
        newEmail:{
          required: "You Need To Enter An Email"
        }
      }
    })

  validatePassForm:()=>
    $(@form1).validate({
      rules: {
        oldPass: {
          required: true
        },
        password: {
          required: true
          passwordpolicy:true
          minlength:8
          notEqual: "#oldPass"
        },
        conPass:{
          required: true
          equalTo:"#newPass"
        }
      },
      messages: {
        oldPass: {
          required: "Please Enter Your Old Password"
        },
        password: {
          required: "Please Enter A New Password"
        },
        conPass:{
          required: "Please Enter A Confirmation Password"
          equalTo:"Your Confirmation Password Did Not Match Your Above Password",
        }
      }
    })

  onSave: (item,type,andThen)->
    postURL = cp.buildSafeUrl("/ad/usergroupdb/#{type}")
    $.ajax({
      type: 'put'
      url: postURL
      contentType: 'application/json'
      data: JSON.stringify(item)
      success: andThen
      error: (jqXHR, textStatus, errorThrown) =>
        alert(jqXHR.responseText)
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

  result:(data)->
    console.info(data)


  savePassSuccess: ()->
    alert("Changed Password Successfully")

  saveEmailSuccess: ()->
    alert("Changed Email Successfully")


class UserPassword
  constructor: (@name,@newpass,@oldpass) ->

class UserEmail
  constructor: (@name,@newemail,@pass) ->

cp.UserPassword = UserPassword
cp.UserEdit=UserEdit
cp.UserEmail = UserEmail
