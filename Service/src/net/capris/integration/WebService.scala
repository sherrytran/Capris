package net.capris.integration

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
  
  
  get("/get/activity") {
    try {
      future(JSONResponse(JsonFormatter.build(Activity.activityList())))
    }
    catch {
      case ex : Exception =>
        log.error(s"Error getting activity list",ex)
        future(ErrorResponse(503,"Server unable to respond, please try again later"))
    }
  }
  
  post("/update/activity") {
    val body = request.bodyText
    log.info(body)
    val activity = JsonParser.parse(body).extract[Activity.ActivityDetail]
    log.info(activity)
    val creds = Authentication.credentials
    Activity.insertActivityDetail(activity) match {
        case LogMessage.None => 
          log.info("Updated activity successfully")
          future(OkResponse)
        case msg => 
          future(ErrorResponse(400,msg.toString))
      }
    
  }

}
