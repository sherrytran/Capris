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
          future(OkResponse)
        case msg => 
          future(ErrorResponse(400,msg.toString))
      }
    
  }
  
  get("/get/ccc-term/:div") {
    val text = params(":div")
    println(text)
    try {
      future(JSONResponse(JsonFormatter.build(CCCTermDAO.load(text))))
    }
    catch {
      case ex : Exception =>
        log.error(s"Error getting division",ex)
        future(ErrorResponse(503,"Server unable to respond, please try again later"))
    }
  }
  
  get("/get/chit-chat-location/:div") {
    val text = params(":div")
    println(text)
    try {
      future(JSONResponse(JsonFormatter.build(ChitChatActivity.load(text))))
    }
    catch {
      case ex : Exception =>
        log.error(s"Error getting division",ex)
        future(ErrorResponse(503,"Server unable to respond, please try again later"))
    }
  }
  
  post("/update/chit-chat-activity") {
    val body = request.bodyText
    log.info(body)
    val activity = JsonParser.parse(body).extract[ChitChatActivity.Details]
    log.info(activity)
    val creds = Authentication.credentials
    ChitChatActivity.insertChitChatDetail(activity) match {
        case LogMessage.None => 
          log.info("Updated chit chat activity successfully")
          future(OkResponse)
        case msg => 
          future(ErrorResponse(400,msg.toString))
      }
    
  }
  
  post("/update/ccc-term-excel") {
    val body = request.bodyText
    log.info(body)
    val term = JsonParser.parse(body).extract[CCCTermDAO.CCCTermDetail]
    log.info(term)
    val creds = Authentication.credentials
    CCCTermDAO.updateExcel(term) match {
        case LogMessage.None => 
          log.info("Updated ccc term successfully")
          future(OkResponse)
        case msg => 
          future(ErrorResponse(400,msg.toString))
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
          future(OkResponse)
        case msg => 
          future(ErrorResponse(400,msg.toString))
      }
    
  }
  
   post("/housevisit/update") {
    val body = request.bodyText
    log.info(body)
    val events = JsonParser.parse(body).extract[Model.Event]
    log.info(events)
    val creds = Authentication.credentials
    HouseVisit.UpdateHouseVisit2(events) match {
        case LogMessage.None => 
          log.info("Updated house visit successfully")
          future(OkResponse)
        case msg => 
          msg.log(log)
          future(ErrorResponse(400,msg.toString))
      }
    
  }

}
