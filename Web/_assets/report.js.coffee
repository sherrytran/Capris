class ReportCate
  constructor: () ->
   	cred=cp.credentials
   	console.info(cred)
   	$("a#user").text("Welcome, "+cred.username)
   	if(cred.username!="admin")
   	  $("#areportdiv").hide()
   	  $("#breportdiv").hide()
   	  $("#areport").hide()
   	  $("#breport").hide()
   	  $("#log").hide()


$(document).ready(()->
  new ReportCate()
)