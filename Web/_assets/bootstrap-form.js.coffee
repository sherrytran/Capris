class HorizontalBootstrapForm

  @DefaultOptions: ()->
  	labelClass: "col-sm-2"
  	fieldClass: "col-sm-10"
  	offsetClass: "col-sm-offset-2"

  @ThreeNineOptions: ()->
    labelClass: "col-sm-3"
    fieldClass: "col-sm-9"
    offsetClass: "col-sm-offset-3"

  @OneElevenOptions: ()->
    labelClass: "col-sm-1"
    fieldClass: "col-sm-11"
    offsetClass: "col-sm-offset-1"

  @AllInOneOptions: ()->
    labelClass: ""
    fieldClass: "col-sm-12"
    offsetClass: ""

  constructor: (parent,options)->
    @form = $("<form class='form-horizontal' role='form'></form>").appendTo(parent)
    @options = _.defaults({},options,HorizontalBootstrapForm.DefaultOptions())
    @currentGroup = null

  addGroup : () -> 
    @currentGroup = $("<div class='form-group'></div>").appendTo(@form) 
    @currentGroup

  addLabel: (text) -> 
  	$("<label class='#{@options.labelClass} control-label'>#{text}</label>").appendTo(@currentGroup)

  addField: ()->
    $("<div class='#{@options.fieldClass}'></div>").appendTo(@currentGroup)

  addStatic: (text) ->
    $("<p class='form-control-static'>#{text}</p>").appendTo(@addField())

  configureInputConstraints: (inputField,type)->
    switch (type)
      when "email" then new biz.Input.Email(inputField)
      when "tel" then new biz.Input.Tel(inputField)

  addInput: (type,value,maxLength) ->
    inputField = $("<input class='form-control' type='#{type}' value='#{value}'></input>").appendTo(@addField())
    if (maxLength) then inputField.attr("maxlength",maxLength)
    @configureInputConstraints(inputField,type)
    inputField

  addInputChoices: (type,value,maxLength,list) ->
    inputField = $("<input class='form-control' type='#{type}' list='#{list}' value='#{value}'></input>").appendTo(@addField())
    if (maxLength) then inputField.attr("maxlength",maxLength)
    @configureInputConstraints(inputField,type)
    inputField

  addTextArea: (value,maxLength) ->
    # this doesn't work  it causes the datalist popup to appear on chrome whenever text is typed in the textarea
    #inputField = $("<textarea class='form-control'>#{value}</textarea>").appendTo(@addField())
    #if (maxLength) then inputField.attr("maxlength",maxLength)
    #inputField
    @addInput("text",value,maxLength)

  addSelect: ()->
    $("<select class='form-control'></select>").appendTo(@addField())

  addCheckbox: (text)->
    field = @addField()
    label = $("<label>#{text}</label>").appendTo(field)
    input = $("<input type='checkbox'></input>").css("margin-right","5px").prependTo(label)
    field.val = (v)->
      if (arguments.length==0) then input.prop("checked")
      else input.prop("checked",!!v)
    field

  hiddenRow: (value)->
    $("<input type='hidden' value='#{value}'></input>").appendTo(@form)

  divRow: (label)->
    @addGroup()
    @addLabel(label)
    $("<div></div>").appendTo(@addField())

  fixedRow: (label,value)->
  	@addGroup()
  	@addLabel(label)
  	@addStatic(value || "")

  inputRow: (label,value,maxLength)->
  	@addGroup()
  	@addLabel(label)
  	@addInput("text",value || "",maxLength)

  textAreaRow: (label,value,maxLength)->
    @addGroup()
    @addLabel(label)
    @addTextArea(value || "",maxLength)

  inputChoicesRow: (label,value,maxLength,list)->
    @addGroup()
    @addLabel(label)
    @addInputChoices("text",value || "",maxLength,list)

  passwordRow: (label)->
  	@addGroup()
  	@addLabel(label)
  	@addInput("password","")

  typedInputRow: (type,label,value,maxLength)->
    @addGroup()
    @addLabel(label)
    @addInput(type,value || "",maxLength)

  selectRow: (label)->
    @addGroup()
    @addLabel(label)
    @addSelect()

  checkboxRow: (label)->
    @addGroup()
    @addLabel("")
    @addCheckbox(label)

  inputRowWithButton: (label,value,maxLength,buttonText)->
    @addGroup()
    @addLabel(label)
    field = @addField()
    inputGroup = $("<div class='input-group'></div>").appendTo(field)
    inputField = $("<input class='form-control' type='text' value='#{value}'></input>").appendTo(inputGroup)
    if (maxLength) then inputField.attr("maxlength",maxLength)
    inputSpan = $("<span class='input-group-btn'></span>").appendTo(inputGroup)
    button = $("<button class='btn'>#{buttonText}</button>").appendTo(inputSpan)
    [inputField,button]

  buttonRow: (buttonText)->
    labelClass = labelClass || "col-sm-offset-2 col-sm-10"
    group = @addGroup()
    div = $("<div class='#{@options.offsetClass} #{@options.fieldClass}'>").appendTo(group)
    $("<button class='btn btn-primary'>#{buttonText}</button>").appendTo(div) 

class InlineBootstrapForm

  @DefaultOptions: ()->
    labelClass: "col-sm-3"
    fieldClass: "col-sm-3"
    offsetClass: ""

  constructor: (parent,options)->
    @form = $("<form class='form-inline' role='form'></form>").appendTo(parent)
    @options = _.defaults({},options,InlineBootstrapForm.DefaultOptions())
    @currentGroup = null

  addGroup : () -> 
    @currentGroup = $("<div class='form-group'></div>").appendTo(@form) 
    @currentGroup

  addLabel: (text) -> 
    $("<label class='#{@options.labelClass} control-label'>#{text}</label>").appendTo(@currentGroup)

  addField: ()->
    $("<div class='#{@options.fieldClass}'></div>").appendTo(@currentGroup)

  checkboxRow: (text)->
    #@addGroup()
    @currentGroup = $("<div></div>").appendTo(@form) 
    @currentGroup
    label = @addLabel(text)
    input = $("<input type='checkbox'></input>").css("margin-right","5px").prependTo(label)
    wrapper = {
      val: (v)->
        if (arguments.length==0) then input.prop("checked")
        else input.prop("checked",!!v)
    }
    wrapper

class SingaporeDollarsInput
  constructor: (parent)->
    @div1 = $("<div class='input-group pull-left'></div>").css("width","150px").appendTo(parent)
    $("<span class='input-group-addon'>S$</span>").appendTo(@div1)
    @dollars = $("<input class='form-control' type='text' maxlength='9' cols='9'></input>").css("text-align","right").appendTo(@div1)
    @div2 = $("<div class='input-group pull-left'></div>").css("width","70px").appendTo(parent)
    $("<span class='input-group-addon'>.</span>").appendTo(@div2)
    @cents = $("<input class='form-control' type='text' maxlength='2' cols='2'></input>").appendTo(@div2)
    new biz.Input.Numeric(@dollars)
    new biz.Input.Numeric(@cents)

  val: (v)->
    if (arguments.length==0)
      (parseInt(@dollars.val()) * 100) + parseInt(@cents.val())
    else
      if (v=="0" || v=="") then v = 0
      v = Math.floor(v)
      cents = "" + (v % 100)
      if (cents<10) then cents = "0"+cents
      dollars = (v / 100).toFixed(0)
      @dollars.val(dollars)
      @cents.val(cents)

class BankAccountInput
  constructor: (parent)->
    @div1 = $("<div class='input-group pull-left'></div>").css("width","70px").appendTo(parent)
    @bank = $("<input class='form-control' title='Bank No.' type='text' maxlength='4' cols='4'></input>").css("text-align","right").appendTo(@div1)
    @div2 = $("<div class='input-group pull-left'></div>").css("width","80px").appendTo(parent)
    $("<span class='input-group-addon'>-</span>").appendTo(@div2)
    @branch = $("<input class='form-control' title='Branch No.' type='text' maxlength='3' cols='3'></input>").appendTo(@div2)
    @div3 = $("<div class='input-group pull-left'></div>").css("width","160px").appendTo(parent)
    $("<span class='input-group-addon'>-</span>").appendTo(@div3)
    @account = $("<input class='form-control' title='Account No.' type='text' maxlength='11' cols='11'></input>").appendTo(@div3)
    new biz.Input.Numeric(@bank)
    new biz.Input.Numeric(@branch)
    new biz.Input.Numeric(@account)

  val: (v)->
    if (arguments.length==0)
      {bank: @bank.val(), branch: @branch.val(), account: @account.val()}
    else
      @bank.val(v.bank || "")
      @branch.val(v.branch || "")
      @account.val(v.account || "")

cp.HorizontalBootstrapForm = HorizontalBootstrapForm
cp.InlineBootstrapForm = InlineBootstrapForm
cp.SingaporeDollarsInput = SingaporeDollarsInput
cp.BankAccountInput = BankAccountInput
