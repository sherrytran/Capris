class LoginLogout
  constructor: () ->
    logout=$("#logout")
    logout.click((ev)-> 
      $("#logoff-form").submit()
      false)

$(document).ready(()->
  new LoginLogout()
)