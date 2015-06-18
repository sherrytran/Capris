package net.capris.webservice

import scala.concurrent._
import com.elixirtech.json.JsonFormatter
import akka.actor.Actor
import akka.actor.Props
import akka.actor.ActorSystem
import akka.actor.ActorRef
import com.elixirtech.arch._
import com.elixirtech.api._
import com.elixirtech.ask._
import com.elixirtech.http.server._
import com.elixirtech.arch.security.Authentication
import org.json4s._
import org.json4s.native._
import net.capris.service.db.CaprisDB
import net.capris.DAO._
import net.capris.housevisit._


object WebService {
  
}

class WebService extends Actor
  with AsyncService
  with AsyncStepMethodHandler
  with ShutdownHandler
  with LoggingHelper2 {

  import WebService._
  import VivaceSettings._
  
    
  implicit val exeCxt = context.dispatcher
  
  implicit val jsonFormats = DefaultFormats
  
  CaprisDB.testInit
  
  post("/update/css-gcc-activity") {
    val body = request.bodyText
    log.info(body)
    val activity = JsonParser.parse(body).extract[CssGccEvent.Event]
    log.info(activity)
    val creds = Authentication.credentials
     CssGccEvent.insertEvent(activity) match {
        case LogMessage.None => 
          log.info("Updated CSS GCC activity successfully")
          Future(OkResponse)
        case msg => 
          Future{ErrorResponse(400,msg.toString)}
      }
    
  }
  
  get("/get/c-cdd-cs-div") {
    try {
      Future(JSONResponse(JsonFormatter.build(CCddCsDivDAO.load())))
    }
    catch {
      case ex : Exception =>
        log.error(s"Error getting division",ex)
        Future(ErrorResponse(503,"Server unable to respond, please try again later"))
    }
  }
  
  get("/get/ccc-term/:div") {
    val text = params(":div")
    println(text)
    try {
      Future(JSONResponse(JsonFormatter.build(CCCTermDAO.load(text))))
    }
    catch {
      case ex : Exception =>
        log.error(s"Error getting division",ex)
        Future(ErrorResponse(503,"Server unable to respond, please try again later"))
    }
  }
  
  get("/get/chit-chat-location/:div") {
    val text = params(":div")
    println(text)
    try {
      Future(JSONResponse(JsonFormatter.build(ChitChatActivity.load(text))))
    }
    catch {
      case ex : Exception =>
        log.error(s"Error getting division",ex)
        Future(ErrorResponse(503,"Server unable to respond, please try again later"))
    }
  }
  
  post("/update/chit-chat-activity") {
    val body = request.bodyText
    log.info(body)
    val activity = JsonParser.parse(body).extract[ChitChatActivity.Details]
    log.info(activity)
    val user = Authentication.username
    ChitChatActivity.insertChitChatDetail(activity,user) match {
        case LogMessage.None => 
          log.info("Updated chit chat activity successfully")
          Future(OkResponse)
        case msg => 
          Future(ErrorResponse(400,msg.toString))
      }
    
  }
  
  post("/update/ccc-term-excel") {
    val body = request.bodyText
    log.info(body)
    val term = JsonParser.parse(body).extract[CCCTermDAO.CCCTermDetail]
    log.info(term)
    val user = Authentication.username()
    CCCTermDAO.updateExcel(term,user) match {
        case LogMessage.None => 
          log.info("Updated ccc term successfully")
          Future(OkResponse)
        case msg => 
          Future(ErrorResponse(400,msg.toString))
      }
    
  }
  
  post("/update/ccc-term-pdf") {
    val body = request.bodyText
    log.info(body)
    val term = JsonParser.parse(body).extract[CCCTermDAO.CCCTermDetail]
    log.info(term)
    val creds = Authentication.credentials
    CCCTermDAO.updatePDF(term) match {
        case LogMessage.None => 
          log.info("Updated ccc term successfully")
          Future(OkResponse)
        case msg => 
          Future(ErrorResponse(400,msg.toString))
      }
    
  }
  
   post("/update/house-visit-activity-plan") {
    val body = request.bodyText
    log.info(body)
    val events = JsonParser.parse(body).extract[Model.Event]
    log.info(events)
    val user = Authentication.username()
    log.info("user: "+user)
    HouseVisit.UpdateHouseVisit2(events,user) match {
        case LogMessage.None => 
          log.info("Updated house visit successfully")
          Future(OkResponse)
        case msg => 
          msg.log(log)
          Future(ErrorResponse(400,msg.toString))
      }
    
  }
   
  post("/update/announcement") {
    val body = request.bodyText
    log.info(body)
    val activity = JsonParser.parse(body).extract[AnnouncementDAO.AnnouncementDetail]
    log.info(activity)
    val user = Authentication.username()
     AnnouncementDAO.insertAnnouncementActivity(activity,user) match {
        case LogMessage.None => 
          log.info("Updated Announcement successfully")
          Future(OkResponse)
        case msg => 
          Future{ErrorResponse(400,msg.toString)}
      }
    
  }
  
  post("/update/calendar") {
    val body = request.bodyText
    val activity = JsonParser.parse(body).extract[CalendarDAO.CalendarDetail]
   val user = Authentication.username()
     CalendarDAO.insertCalendarActivity(activity,user) match {
        case LogMessage.None => 
          log.info("Updated Calendar successfully")
          Future(OkResponse)
        case msg => 
          Future{ErrorResponse(400,msg.toString)}
      }
    
  }
  
  post("/update/print-letter-status") {
    val body = request.bodyText
    log.info(body)
    val info = JsonParser.parse(body).extract[WelcomeLetterDAO.PeopleInfoList]
    log.info(info)
    WelcomeLetterDAO.UpdateWelcomeLetter(info) match {
        case LogMessage.None => 
          log.info("Updated ccc term successfully")
          Future(OkResponse)
        case msg => 
          Future(ErrorResponse(400,msg.toString))
      }
    
  }

}
