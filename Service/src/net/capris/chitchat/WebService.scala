package net.capris.chitchat

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
import net.capris.housevisit.HouseVisit
import org.json4s._
import org.json4s.native._
import net.capris.service.db.CaprisDB

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
  
  
  post("/update/chit-chat-activity") {
    val body = request.bodyText
    log.info(body)
    val activity = JsonParser.parse(body).extract[Activity.Details]
    log.info(activity)
    val creds = Authentication.credentials
    Activity.insertChitChatDetail(activity) match {
        case LogMessage.None => 
          log.info("Updated chit chat activity successfully")
          future(OkResponse)
        case msg => 
          future(ErrorResponse(400,msg.toString))
      }
    
  }

}
